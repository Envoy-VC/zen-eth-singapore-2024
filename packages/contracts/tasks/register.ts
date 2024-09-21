import { task } from 'hardhat/config';

task('task:register').setAction(async (_args, hre) => {
  const { ethers, deployments, fhenixjs } = hre;
  const [owner, otherAccount] = await ethers.getSigners();

  if (!owner || !otherAccount) {
    return;
  }

  const profileAddress = (await deployments.get('ProfileNFT')).address;
  console.log('Profile Address:', profileAddress);
  const profile = await ethers.getContractAt('ProfileNFT', profileAddress);

  const permit = await fhenixjs.generatePermit(
    profileAddress,
    undefined,
    // provider,
    otherAccount
  );

  const permission = fhenixjs.extractPermitPermission(permit);

  const fheOther = await Promise.all([fhenixjs, permission]).then(
    ([instance, permission]) => ({
      instance,
      permission,
      permit,
    })
  );

  const privateData = Buffer.from(
    JSON.stringify({ location: 'india' })
  ).toString('hex');

  const ePrivateData = await fheOther.instance.encrypt_uint256(privateData);

  const tx = await profile
    .connect(otherAccount)
    .register(
      await otherAccount.getAddress(),
      { namespace: 'zen', localName: 'envoy1084' },
      ePrivateData
    );

  await tx.wait();
});
