import { useState } from 'react';

import { usePermissions } from '~/lib/hooks';
import { errorHandler } from '~/lib/utils';
import {
  followModuleConfig,
  profileContractConfig,
  wagmiConfig,
} from '~/lib/viem';

import { useMutation } from '@tanstack/react-query';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import Avatars from 'avvvatars-react';
import { toast } from 'sonner';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { env } from '~/env';

import { Avatar } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import {
  TextCopy,
  TextCopyButton,
  TextCopyContent,
} from '~/components/ui/text-copy';

interface UserDetailsProps {
  handleLocalName: string;
  handleNamespace: string;
  owner: string;
  tokenId: string;
}

export const UserDetails = ({
  handleLocalName,
  handleNamespace,
  owner,
  tokenId,
}: UserDetailsProps) => {
  const { address } = useAccount();
  const { data: followers } = useReadContract({
    abi: followModuleConfig.abi,
    address: followModuleConfig.address as `0x${string}`,
    functionName: '_totalFollowers',
    args: [BigInt(tokenId)],
    query: {
      refetchInterval: 1500,
    },
  });

  const { getPermit, unsealResponse } = usePermissions();

  const [totalFollowers, setTotalFollowers] = useState<number | null>(null);

  const getTotalFollowers = async () => {
    try {
      if (!address) {
        throw new Error('Invalid address');
      }
      const permit = await getPermit(
        followModuleConfig.address as `0x${string}`
      );
      const res = await readContract(wagmiConfig, {
        abi: followModuleConfig.abi,
        address: followModuleConfig.address as `0x${string}`,
        functionName: 'getFollowers',
        args: [
          BigInt(tokenId),
          {
            publicKey: permit.publicKey as `0x${string}`,
            signature: permit.signature as `0x${string}`,
          },
          address,
        ],
      });

      const unsealed = await unsealResponse(res, followModuleConfig.address);
      setTotalFollowers(Number(unsealed));
    } catch (error) {
      toast.error(errorHandler(error));
    }
  };

  const { data: privateData } = useReadContract({
    abi: profileContractConfig.abi,
    address: profileContractConfig.address as `0x${string}`,
    functionName: '_privateData',
    args: [BigInt(tokenId)],
    query: {
      refetchInterval: 1500,
    },
  });

  const { data: isFollowing } = useReadContract({
    abi: followModuleConfig.abi,
    address: followModuleConfig.address as `0x${string}`,
    functionName: '_follows',
    args: [BigInt(tokenId), address ?? '0x0'],
    query: {
      refetchInterval: 1500,
    },
  });

  const { writeContractAsync } = useWriteContract();

  const follow = async () => {
    try {
      if (!address) {
        throw new Error('No account found');
      }
      const hash = await writeContractAsync({
        abi: followModuleConfig.abi,
        address: followModuleConfig.address as `0x${string}`,
        functionName: 'follow',
        args: [BigInt(tokenId), address],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
      toast.success('Followed Successfully');
    } catch (error) {
      toast.error(errorHandler(error));
    }
  };
  const unfollow = async () => {
    try {
      if (!address) {
        throw new Error('No account found');
      }
      const hash = await writeContractAsync({
        abi: followModuleConfig.abi,
        address: followModuleConfig.address as `0x${string}`,
        functionName: 'unfollow',
        args: [BigInt(tokenId), address],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
      toast.success('Unfollowed Successfully');
    } catch (error) {
      toast.error(errorHandler(error));
    }
  };

  const { mutateAsync, data: unsealed } = useMutation({
    mutationFn: async () => {
      try {
        if (!address) {
          throw new Error('No account found');
        }
        const permit = await getPermit(
          env.NEXT_PUBLIC_PROFILE_ADDRESS as `0x${string}`
        );
        const sealed = await readContract(wagmiConfig, {
          abi: profileContractConfig.abi,
          address: profileContractConfig.address as `0x${string}`,
          functionName: 'tokenPrivateData',
          args: [
            BigInt(tokenId),
            {
              publicKey: permit.publicKey as `0x${string}`,
              signature: permit.signature as `0x${string}`,
            },
            address,
          ],
        });

        const usealed = await unsealResponse(
          sealed,
          env.NEXT_PUBLIC_PROFILE_ADDRESS as `0x${string}`
        );
        return JSON.stringify(
          JSON.parse(Buffer.from(usealed.toString(16), 'hex').toString('utf-8'))
        );
      } catch (error) {
        toast.error(errorHandler(error));
      }
    },
  });

  return (
    <div className='flex -translate-y-[3.5rem] flex-col gap-4 px-10 md:-translate-y-[6rem]'>
      <div className='bg-background-secondary w-fit rounded-2xl p-2 sm:p-3'>
        <Avatar className='h-full max-h-[7rem] w-full max-w-[7rem] rounded-xl sm:max-h-[12rem] sm:max-w-[12rem]'>
          <Avatars
            size={192}
            style='shape'
            value={`${handleLocalName}.${handleNamespace}`}
          />
        </Avatar>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='font-bold text-xl sm:text-2xl'>
          {handleLocalName}.{handleNamespace}
        </div>
        <div className='text-foreground-secondary font-medium text-sm sm:text-base'>
          <span className='flex min-w-full items-center gap-2 font-medium'>
            Consumer Address:
          </span>
          <TextCopy
            text={owner}
            truncateOptions={{ enabled: true, length: 20, fromMiddle: true }}
            type='text'
          >
            <TextCopyContent />
            <TextCopyButton />
          </TextCopy>
        </div>
        <div className='text-foreground-secondary flex flex-row gap-3 font-medium text-sm sm:text-base'>
          <span className='flex items-center gap-2 font-medium'>Token Id:</span>
          <TextCopy text={tokenId} type='text'>
            <TextCopyContent />
            <TextCopyButton />
          </TextCopy>
        </div>
      </div>
      <div className='flex flex-row items-center gap-6 text-sm sm:text-base'>
        <div className='flex flex-col'>
          <div className='font-regular text-2xl'>
            {!totalFollowers ? (
              <TextCopy
                text={followers?.toString()}
                type='text'
                truncateOptions={{
                  enabled: true,
                  length: 12,
                  fromMiddle: true,
                }}
              >
                <TextCopyContent />
              </TextCopy>
            ) : (
              <div>{totalFollowers}</div>
            )}
          </div>
          <div className='text-foreground-secondary'>Followers</div>
        </div>
        {!totalFollowers && (
          <Button
            onClick={async () => {
              await getTotalFollowers();
            }}
          >
            Unseal Followers
          </Button>
        )}
      </div>
      <div className='flex flex-row items-center gap-6 text-sm sm:text-base'>
        <div className='flex flex-col'>
          <div className='font-regular text-2xl'>
            {followers !== undefined ? (
              <TextCopy
                text={privateData?.toString()}
                type='text'
                truncateOptions={{
                  enabled: true,
                  length: 12,
                  fromMiddle: true,
                }}
              >
                <TextCopyContent />
              </TextCopy>
            ) : (
              <Skeleton className='h-10 w-20' />
            )}
          </div>
          <div className='text-foreground-secondary'>Private Data</div>
        </div>
      </div>
      <div className='flex flex-row items-center gap-6 text-sm sm:text-base'>
        {unsealed ? (
          <div className='flex flex-col'>
            {Object.entries(JSON.parse(unsealed) as object).map(([k, v]) => {
              return (
                <div key={k} className='flex flex-row gap-2'>
                  <div className='font-medium'>{k}: </div>
                  <div className='font-regular'>{String(v)}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <Button
            onClick={async () => {
              await mutateAsync();
            }}
          >
            Unseal Private Data
          </Button>
        )}
      </div>

      {address?.toLowerCase() !== owner.toLowerCase() && (
        <Button
          onClick={async () => {
            if (isFollowing) {
              await unfollow();
            } else {
              await follow();
            }
          }}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      )}
    </div>
  );
};
