import hre from 'hardhat';
import { getTokensFromFaucet } from './get-tokens';
import type {
  ProfileNFT,
  HandleModule,
  FollowModule,
  PublicationModule,
  PollModule,
} from 'typechain-types';
import type { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import { ZeroAddress } from 'ethers/constants';

export interface ZenState {
  profile: ProfileNFT;
  handleModule: HandleModule;
  followModule: FollowModule;
  publicationModule: PublicationModule;
  pollModule: PollModule;
  owner: HardhatEthersSigner;
  otherAccount: HardhatEthersSigner;
}

export const deploy = async (): Promise<ZenState> => {
  const [owner, otherAccount] = await hre.ethers.getSigners();

  if (!owner || !otherAccount) {
    throw new Error('No owner or other account available');
  }

  await getTokensFromFaucet(owner);
  await getTokensFromFaucet(otherAccount);

  const ownerAddress = await owner.getAddress();

  // Deploy all Modules
  const HandleModule = await hre.ethers.getContractFactory('HandleModule');
  const handleModule = await HandleModule.connect(owner).deploy(
    ownerAddress,
    ZeroAddress
  );
  await handleModule.waitForDeployment();
  const handleAddress = await handleModule.getAddress();

  const FollowModule = await hre.ethers.getContractFactory('FollowModule');
  const followModule = await FollowModule.connect(owner).deploy(
    ownerAddress,
    ZeroAddress
  );
  await followModule.waitForDeployment();
  const followAddress = await followModule.getAddress();

  const PublicationModule =
    await hre.ethers.getContractFactory('PublicationModule');
  const publicationModule = await PublicationModule.connect(owner).deploy(
    ownerAddress,
    ZeroAddress
  );
  await publicationModule.waitForDeployment();
  const publicationAddress = await publicationModule.getAddress();

  const PollModule = await hre.ethers.getContractFactory('PollModule');
  const pollModule = await PollModule.connect(owner).deploy(
    ownerAddress,
    ZeroAddress
  );
  await pollModule.waitForDeployment();
  const pollAddress = await pollModule.getAddress();

  // Deploy Profile NFT
  const ProfileNFT = await hre.ethers.getContractFactory('ProfileNFT');
  const profileNFT = await ProfileNFT.connect(owner).deploy(
    'Zen',
    'ZEN',
    handleAddress,
    followAddress,
    publicationAddress,
    pollAddress
  );
  await profileNFT.waitForDeployment();
  const profileAddress = await profileNFT.getAddress();

  // update Profile in all modules
  let tx;
  tx = await handleModule.connect(owner).setProfileNFT(profileAddress);
  await tx.wait();
  tx = await followModule.connect(owner).setProfileNFT(profileAddress);
  await tx.wait();
  tx = await publicationModule.connect(owner).setProfileNFT(profileAddress);
  await tx.wait();
  tx = await pollModule.connect(owner).setProfileNFT(profileAddress);
  await tx.wait();

  return {
    profile: profileNFT,
    handleModule,
    followModule,
    publicationModule,
    pollModule,
    owner,
    otherAccount,
  };
};
