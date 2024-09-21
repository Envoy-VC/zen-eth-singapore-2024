/* eslint-disable import/no-default-export -- safe for hardhat deploy */
import type { DeployFunction } from 'hardhat-deploy/types';

import hre from 'hardhat';
import { ZeroAddress } from 'ethers';

import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'node:fs';
// @ts-expect-error safe to ignore missing types
import yaml from 'json-to-pretty-yaml';

const path = '../../apps/www/.env';
const path2 = '../../packages/indexer/.env';
dotenv.config({ path });
dotenv.config({ path: path2 });

const func: DeployFunction = async function () {
  const { ethers } = hre;
  // eslint-disable-next-line @typescript-eslint/unbound-method -- safe
  const { deploy } = hre.deployments;
  const [owner, otherAccount] = await ethers.getSigners();

  await hre.fhenixjs.getFunds('0x2b7a8f9c4c38352304dd47082910546d867c3a3e');
  await hre.fhenixjs.getFunds('0xe269688F24e1C7487f649fC3dCD99A4Bf15bDaA1');
  await hre.fhenixjs.getFunds('0xBF4979305B43B0eB5Bb6a5C67ffB89408803d3e1');

  if (!owner || !otherAccount) {
    throw new Error('No owner available');
  }

  const ownerAddress = await owner.getAddress();

  console.log('Deploying with  Address: ', owner.address);
  if (hre.network.name === 'localfhenix') {
    await hre.fhenixjs.getFunds(owner.address);
    await hre.fhenixjs.getFunds(otherAccount.address);
  }

  const handleModule = await deploy('HandleModule', {
    from: owner.address,
    args: [ownerAddress, ZeroAddress],
    skipIfAlreadyDeployed: false,
  });

  writeFileSync(
    '../../packages/indexer/abis/HandleModule.abi.json',
    JSON.stringify(handleModule.abi)
  );

  const followModule = await deploy('FollowModule', {
    from: owner.address,
    args: [ownerAddress, ZeroAddress],
    skipIfAlreadyDeployed: false,
  });

  writeFileSync(
    '../../packages/indexer/abis/FollowModule.abi.json',
    JSON.stringify(followModule.abi)
  );

  const publicationModule = await deploy('PublicationModule', {
    from: owner.address,
    args: [ownerAddress, ZeroAddress],
    skipIfAlreadyDeployed: false,
  });

  writeFileSync(
    '../../packages/indexer/abis/PublicationModule.abi.json',
    JSON.stringify(publicationModule.abi)
  );

  const pollModule = await deploy('PollModule', {
    from: owner.address,
    args: [ownerAddress, ZeroAddress],
    skipIfAlreadyDeployed: false,
  });

  writeFileSync(
    '../../packages/indexer/abis/PollModule.abi.json',
    JSON.stringify(pollModule.abi)
  );

  const auctionModule = await deploy('AuctionModule', {
    from: owner.address,
    args: [ownerAddress, ZeroAddress],
    skipIfAlreadyDeployed: false,
  });

  writeFileSync(
    '../../packages/indexer/abis/AuctionModule.abi.json',
    JSON.stringify(auctionModule.abi)
  );

  const profileNFT = await deploy('ProfileNFT', {
    from: owner.address,
    args: [
      'Zen',
      'ZEN',
      handleModule.address,
      followModule.address,
      publicationModule.address,
      pollModule.address,
      auctionModule.address,
    ],
    skipIfAlreadyDeployed: false,
  });

  writeFileSync(
    '../../packages/indexer/abis/Profile.abi.json',
    JSON.stringify(profileNFT.abi)
  );

  // update Profile in all modules
  let contract;
  contract = await ethers.getContractAt('HandleModule', handleModule.address);
  await contract.connect(owner).setProfileNFT(profileNFT.address);
  contract = await ethers.getContractAt('FollowModule', followModule.address);
  await contract.connect(owner).setProfileNFT(profileNFT.address);
  contract = await ethers.getContractAt(
    'PublicationModule',
    publicationModule.address
  );
  await contract.connect(owner).setProfileNFT(profileNFT.address);
  contract = await ethers.getContractAt('PollModule', pollModule.address);
  await contract.connect(owner).setProfileNFT(profileNFT.address);
  contract = await ethers.getContractAt('AuctionModule', auctionModule.address);
  await contract.connect(owner).setProfileNFT(profileNFT.address);

  console.log('Owner: ', ownerAddress);
  console.log('HandleModule Address: ', handleModule.address);
  console.log('FollowModule Address: ', followModule.address);
  console.log('PublicationModule Address: ', publicationModule.address);
  console.log('PollModule Address: ', pollModule.address);
  console.log('AuctionModule Address: ', auctionModule.address);

  console.log('ProfileNFT Address: ', profileNFT.address);

  const config = {
    NEXT_PUBLIC_PROFILE_ADDRESS: profileNFT.address,
    NEXT_PUBLIC_HANDLE_MODULE_ADDRESS: handleModule.address,
    NEXT_PUBLIC_FOLLOW_MODULE_ADDRESS: followModule.address,
    NEXT_PUBLIC_PUBLICATION_MODULE_ADDRESS: publicationModule.address,
    NEXT_PUBLIC_POLL_MODULE_ADDRESS: pollModule.address,
    NEXT_PUBLIC_AUCTION_MODULE_ADDRESS: auctionModule.address,
  };

  const data = readFileSync(path, { encoding: 'utf8' });

  const parsed = dotenv.parse(data);
  let updated = '';
  Object.entries({ ...parsed, ...config }).forEach(([k, v]) => {
    updated += `${k}="${v}"\n`;
  });

  writeFileSync(path, updated, { encoding: 'utf8' });

  const jsonData = {
    name: 'indexer',
    project_type: 'no-code',
    networks: [
      {
        name: 'fhenixLocal',
        chain_id: 42069,
        rpc: 'http://127.0.0.1:42069',
      },
    ],
    storage: {
      postgres: {
        enabled: true,
      },
    },
    contracts: [
      {
        name: 'ProfileNFT',
        details: [
          {
            network: 'fhenixLocal',
            address: profileNFT.address,
            start_block: '0',
          },
        ],
        abi: './abis/Profile.abi.json',
        include_events: ['ProfileCreated'],
      },
      {
        name: 'HandleModule',
        details: [
          {
            network: 'fhenixLocal',
            address: handleModule.address,
            start_block: '0',
          },
        ],
        abi: './abis/HandleModule.abi.json',
        include_events: ['HandleSet'],
      },
      {
        name: 'FollowModule',
        details: [
          {
            network: 'fhenixLocal',
            address: followModule.address,
            start_block: '0',
          },
        ],
        abi: './abis/FollowModule.abi.json',
        include_events: ['Followed', 'Unfollowed'],
      },
      {
        name: 'PublicationModule',
        details: [
          {
            network: 'fhenixLocal',
            address: publicationModule.address,
            start_block: '0',
          },
        ],
        abi: './abis/PublicationModule.abi.json',
        include_events: ['PublicationCreated'],
      },
      {
        name: 'PollModule',
        details: [
          {
            network: 'fhenixLocal',
            address: pollModule.address,
            start_block: '0',
          },
        ],
        abi: './abis/PollModule.abi.json',
        include_events: ['PollCreated', 'PollEnded', 'Voted'],
      },
      {
        name: 'AuctionModule',
        details: [
          {
            network: 'fhenixLocal',
            address: auctionModule.address,
            start_block: '0',
          },
        ],
        abi: './abis/AuctionModule.abi.json',
        include_events: ['AuctionCreated'],
      },
    ],
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- safe to ignore no types
  const yamlString = yaml.stringify(jsonData) as string;
  writeFileSync('../../packages/indexer/rindexer.yaml', yamlString, {
    encoding: 'utf8',
  });
};

export default func;
func.id = 'deploy_contracts';
