/* eslint-disable import/no-default-export -- safe for hardhat deploy */
import type { DeployFunction } from 'hardhat-deploy/types';

import hre from 'hardhat';
import { ZeroAddress } from 'ethers';

import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'node:fs';

const path = '../../apps/www/.env';
dotenv.config({ path });

const func: DeployFunction = async function () {
  const { ethers } = hre;
  // eslint-disable-next-line @typescript-eslint/unbound-method -- safe
  const { deploy } = hre.deployments;
  const [owner, otherAccount] = await ethers.getSigners();

  await hre.fhenixjs.getFunds('0x2b7a8f9c4c38352304dd47082910546d867c3a3e');
  await hre.fhenixjs.getFunds('0xe269688F24e1C7487f649fC3dCD99A4Bf15bDaA1');

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

  const followModule = await deploy('FollowModule', {
    from: owner.address,
    args: [ownerAddress, ZeroAddress],
    skipIfAlreadyDeployed: false,
  });

  const publicationModule = await deploy('PublicationModule', {
    from: owner.address,
    args: [ownerAddress, ZeroAddress],
    skipIfAlreadyDeployed: false,
  });

  const pollModule = await deploy('PollModule', {
    from: owner.address,
    args: [ownerAddress, ZeroAddress],
    skipIfAlreadyDeployed: false,
  });

  const profileNFT = await deploy('ProfileNFT', {
    from: owner.address,
    args: [
      'Zen',
      'ZEN',
      handleModule.address,
      followModule.address,
      publicationModule.address,
      pollModule.address,
    ],
    skipIfAlreadyDeployed: false,
  });

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

  console.log('Owner: ', ownerAddress);
  console.log('HandleModule Address: ', handleModule.address);
  console.log('FollowModule Address: ', followModule.address);
  console.log('PublicationModule Address: ', publicationModule.address);
  console.log('PollModule Address: ', pollModule.address);

  console.log('ProfileNFT Address: ', profileNFT.address);

  const config = {
    NEXT_PUBLIC_PROFILE_ADDRESS: profileNFT.address,
    NEXT_PUBLIC_HANDLE_MODULE_ADDRESS: handleModule.address,
    NEXT_PUBLIC_FOLLOW_MODULE_ADDRESS: followModule.address,
    NEXT_PUBLIC_PUBLICATION_MODULE_ADDRESS: publicationModule.address,
    NEXT_PUBLIC_POLL_MODULE_ADDRESS: pollModule.address,
  };

  const data = readFileSync(path, { encoding: 'utf8' });

  const parsed = dotenv.parse(data);
  let updated = '';
  Object.entries({ ...parsed, ...config }).forEach(([k, v]) => {
    updated += `${k}="${v}"\n`;
  });

  writeFileSync(path, updated, { encoding: 'utf8' });
};

export default func;
func.id = 'deploy_contracts';

/**
 * Deploying with  Address:  0xD21eC010344A044e32424B80c84CC88F76BCa5dD
Owner:  0xD21eC010344A044e32424B80c84CC88F76BCa5dD
HandleModule Address:  0xfF0Dc7b7C7Fdaf13C0D6028b2FF890a59b7d8006
FollowModule Address:  0x2f2dF349aA08fD5feC021F46e4B4c0dC10D62Ff3
PublicationModule Address:  0x6B7a0Be734B891C9CB680Cf37559589647590b8f
PollModule Address:  0x0AE79BafD2708Dc0c2B9fE8A5495bBF02E2322a8
ProfileNFT Address:  0x2b2E84f4AC0D155844dF0cD0F60B14d9f960292C
 */
