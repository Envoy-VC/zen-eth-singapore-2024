import { task } from 'hardhat/config';

task('task:get-handle').setAction(async (_args, hre) => {
  const { ethers, deployments } = hre;
  const [owner, otherAccount] = await ethers.getSigners();

  if (!owner || !otherAccount) {
    return;
  }

  const profileAddress = (await deployments.get('ProfileNFT')).address;
  console.log('Profile Address:', profileAddress);
  const profile = await ethers.getContractAt('ProfileNFT', profileAddress);

  console.log(await profile._nextTokenId());
  console.log(await profile.ownerOf(0));
});
