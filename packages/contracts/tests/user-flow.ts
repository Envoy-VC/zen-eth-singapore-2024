import { createFheInstance, deploy, type ZenState } from '../lib';
import { before } from 'mocha';
import hre from 'hardhat';

describe('UserFlow', () => {
  let state: ZenState;
  before(async () => {
    state = await deploy();
  });

  it('should create a profile', async () => {
    const {
      profile,
      otherAccount,
      owner,
      followModule,
      publicationModule,
      pollModule,
    } = state;
    const otherAddress = await otherAccount.getAddress();

    const fheOther = await createFheInstance(
      hre,
      await profile.getAddress(),
      otherAccount
    );

    const privateData = Buffer.from(
      JSON.stringify({ location: 'india' })
    ).toString('hex');

    const ePrivateData = await fheOther.instance.encrypt_uint256(privateData);

    let tx;

    tx = await profile
      .connect(otherAccount)
      .register(
        otherAddress,
        { namespace: 'zen', localName: 'envoy1084' },
        ePrivateData
      );

    await tx.wait();

    console.log('Getting Private Data...');

    const pdata = await profile
      .connect(otherAccount)
      .tokenPrivateData(BigInt(0), fheOther.permit);

    console.log('Private Data:', pdata);

    const unsealed = fheOther.instance.unseal(
      await profile.getAddress(),
      pdata
    );

    console.log(`0x${unsealed.toString(16)}`);

    tx = 1;

    tx = await profile
      .connect(owner)
      .register(
        owner.address,
        { namespace: 'zen', localName: 'bbbbbbb' },
        ePrivateData
      );

    tx = await followModule
      .connect(otherAccount)
      .follow(1, otherAccount.address);

    await tx.wait();

    console.log(await followModule._follows(1, otherAccount.address));

    const followers = await followModule
      .connect(otherAccount)
      .getFollowers(1, fheOther.permit);

    console.log(
      fheOther.instance.unseal(await profile.getAddress(), followers)
    );

    tx = await followModule
      .connect(otherAccount)
      .unfollow(1, otherAccount.address);

    await tx.wait();

    console.log(
      'Other follows Owner: ',
      await followModule._follows(1, otherAccount.address)
    );

    let eContent = await fheOther.instance.encrypt_uint256(
      Buffer.from('my content').toString('hex')
    );

    tx = await publicationModule
      .connect(otherAccount)
      .createPublication(0, 0, eContent, { publicationId: 0, tokenId: 0 }, []);

    console.log(await publicationModule._publications(0, 1));

    console.log(
      await publicationModule
        .connect(otherAccount)
        .getPublicationData(0, 1, fheOther.permit)
    );

    let fheOwner = await createFheInstance(
      hre,
      await profile.getAddress(),
      owner
    );

    tx = await followModule.connect(owner).follow(0, owner.address);
    await tx.wait();

    console.log(
      'Owner follows Other: ',
      await followModule._follows(0, owner.address)
    );

    console.log(
      await publicationModule
        .connect(owner)
        .getPublicationData(0, 1, fheOwner.permit)
    );

    const deadline = Math.round(Date.now() / 1000) + 100;

    tx = await pollModule
      .connect(otherAccount)
      .createPoll(0, 'ipfs://cid', deadline, 4);

    await tx.wait();

    eContent = await fheOther.instance.encrypt_uint8(2);

    tx = await pollModule.connect(owner).voteForPoll(0, 1, eContent);
    await tx.wait();

    fheOwner = await createFheInstance(
      hre,
      await pollModule.getAddress(),
      owner
    );

    tx = await pollModule.connect(otherAccount).endPoll(0, 1);
    await tx.wait();

    const results: string[] = await pollModule
      .connect(owner)
      .getPollResults(0, 1, fheOwner.permit);

    for await (const result of results) {
      console.log(
        fheOwner.instance.unseal(await pollModule.getAddress(), result)
      );
    }
  });
});
