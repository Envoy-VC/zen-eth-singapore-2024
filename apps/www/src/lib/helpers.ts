import { ethers } from 'ethers';
import { FhenixClient } from 'fhenixjs';

import { localFhenix } from './viem/chains';

const getClient = () => {
  const fhenixProvider = new ethers.JsonRpcProvider(
    localFhenix.rpcUrls.default.http[0]
  );

  return new FhenixClient({
    // @ts-expect-error -- safe types
    provider: fhenixProvider,
  });
};

export const encryptPrivateData = async (data: string) => {
  const client = getClient();
  const hex = Buffer.from(data).toString('hex');
  const res = await client.encrypt_uint256(hex);
  return { data: `0x${Buffer.from(res.data).toString('hex')}` };
};

export const encryptVoteOption = async (option: number) => {
  const client = getClient();
  const res = await client.encrypt_uint8(option);
  return { data: `0x${Buffer.from(res.data).toString('hex')}` };
};
