import { type Permit, SealingKey } from 'fhenixjs';
import * as nacl from 'tweetnacl';
import { useLocalStorage } from 'usehooks-ts';
import { toHex } from 'viem';
import { useChainId, useSignTypedData } from 'wagmi';

export const toHexString = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const usePermissions = () => {
  const { signTypedDataAsync } = useSignTypedData();
  const chainId = useChainId();

  const [permits, setPermits] = useLocalStorage<Record<string, Permit>>(
    'fhenix-permits',
    {}
  );

  const generatePermit = async (verifyingContract: `0x${string}`) => {
    const sodiumKeypair = nacl.box.keyPair();
    const sig = await signTypedDataAsync({
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Permissioned: [{ name: 'publicKey', type: 'bytes32' }],
      },
      primaryType: 'Permissioned',
      message: {
        publicKey: toHex(sodiumKeypair.publicKey),
      },
      domain: {
        name: 'Fhenix Permission',
        version: '1.0',
        chainId: BigInt(chainId),
        verifyingContract,
      },
    });

    const sealingKey = new SealingKey(
      toHexString(sodiumKeypair.secretKey),
      toHexString(sodiumKeypair.publicKey)
    );

    const permit: Permit = {
      contractAddress: verifyingContract,
      sealingKey,
      signature: sig,
      publicKey: toHex(sodiumKeypair.publicKey),
    };

    const newPermits = permits;
    newPermits[verifyingContract] = permit;
    setPermits(newPermits);
    return permit;
  };

  const getPermit = async (contractAddress: `0x${string}`) => {
    if (permits[contractAddress]) {
      return permits[contractAddress];
    }
    return await generatePermit(contractAddress);
  };

  const unsealResponse = async (data: string, contractAddress: string) => {
    const permit = await getPermit(contractAddress as `0x${string}`);

    const sealingKey = new SealingKey(
      permit.sealingKey.privateKey,
      permit.sealingKey.publicKey
    );

    const res = sealingKey.unseal(data);
    return res;
  };

  return { getPermit, unsealResponse };
};
