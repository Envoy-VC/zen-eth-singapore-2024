/* eslint-disable @next/next/no-img-element -- safe */
import React, { useState } from 'react';

import { encryptAddress, encryptBidAmount } from '~/lib/helpers';
import { usePermissions } from '~/lib/hooks';
import { getJSON } from '~/lib/storage';
import { cn, errorHandler } from '~/lib/utils';
import {
  auctionModuleConfig,
  profileContractConfig,
  wagmiConfig,
} from '~/lib/viem';

import { useQuery } from '@tanstack/react-query';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { toast } from 'sonner';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { SendHorizontalIcon } from 'lucide-react';

interface AuctionCardProps {
  auctionId: string;
  content: string;
  endTime: number;
  startPrice: string;
  startTime: string;
  tokenId: string;
}

export const AuctionCard = (props: AuctionCardProps) => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { getPermit, unsealResponse } = usePermissions();

  const [bidAmount, setBidAmount] = useState<string>('0');
  const [results, setResults] = useState<{
    winner: string;
    bidAmount: string;
  } | null>(null);

  const { data: owner } = useReadContract({
    abi: profileContractConfig.abi,
    address: profileContractConfig.address as `0x${string}`,
    functionName: 'ownerOf',
    args: [BigInt(props.tokenId)],
    query: {
      refetchInterval: 1500,
    },
  });

  const { data: auction } = useQuery({
    queryKey: [props.auctionId, props.tokenId],
    queryFn: async () => {
      const res = (await getJSON(props.content)) as {
        name: string;
        description: string;
        imageCID: string;
      };
      return res;
    },
  });

  const placeBid = async () => {
    try {
      if (!address) {
        throw new Error('User not connected');
      }
      console.log(bidAmount);
      const eBid = await encryptBidAmount(bidAmount);
      const eAddress = await encryptAddress(address);
      const hash = await writeContractAsync({
        abi: auctionModuleConfig.abi,
        address: auctionModuleConfig.address as `0x${string}`,
        functionName: 'placeBid',
        args: [
          BigInt(props.tokenId),
          BigInt(props.auctionId),
          eBid as {
            data: `0x${string}`;
          },
          eAddress as {
            data: `0x${string}`;
          },
        ],
      });

      await waitForTransactionReceipt(wagmiConfig, { hash });
      toast.success('Bid placed successfully');
    } catch (error) {
      toast.error(errorHandler(error));
    }
  };

  const endAuction = async () => {
    const hash = await writeContractAsync({
      abi: auctionModuleConfig.abi,
      address: auctionModuleConfig.address as `0x${string}`,
      functionName: 'endAuction',
      args: [BigInt(props.tokenId), BigInt(props.auctionId)],
    });

    await waitForTransactionReceipt(wagmiConfig, { hash });
    toast.success('Poll Ended Successfully');
  };

  const getWinner = async () => {
    const permit = await getPermit(
      auctionModuleConfig.address as `0x${string}`
    );
    const results = await readContract(wagmiConfig, {
      abi: auctionModuleConfig.abi,
      address: auctionModuleConfig.address as `0x${string}`,
      functionName: 'getWinner',
      args: [
        BigInt(props.tokenId),
        BigInt(props.auctionId),
        {
          publicKey: permit.publicKey as `0x${string}`,
          signature: permit.signature as `0x${string}`,
        },
      ],
    });
    const winnerAddr = await unsealResponse(
      results[0],
      auctionModuleConfig.address
    );
    const winnerBid = await unsealResponse(
      results[1],
      auctionModuleConfig.address
    );

    setResults({
      winner: `0x${winnerAddr.toString()}`,
      bidAmount: winnerBid.toString(),
    });
  };

  return (
    <div className='flex flex-col gap-5 rounded-2xl bg-neutral-100 px-3 py-5'>
      <div className='font-medium text-2xl text-neutral-700'>Auction</div>
      <div className='font-medium text-xl text-neutral-500'>
        {auction?.name}
      </div>
      <p className='text-sm text-neutral-500'>{auction?.description}</p>
      <img
        alt='file'
        className={cn('h-[24rem] w-full rounded-xl object-cover')}
        src={`http://localhost:8080/ipfs/${auction?.imageCID ?? ''}`}
      />
      <div className='flex flex-row items-center gap-2'>
        <Input
          className='h-12 w-full border'
          placeholder='Enter your bid...'
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />
        <Button
          className='h-10 w-10 rounded-full bg-blue-500 p-2 hover:bg-blue-400'
          variant='ghost'
          onClick={placeBid}
        >
          <SendHorizontalIcon
            className='h-5 w-5 !p-0 text-white'
            strokeWidth={2.5}
          />
        </Button>
      </div>
      <div className='flex flex-row items-center gap-2'>
        {address?.toLowerCase() === owner?.toLowerCase() && (
          <Button onClick={endAuction}>End Auction</Button>
        )}
        <Button onClick={getWinner}>Reveal Winner</Button>
      </div>
      {results ? (
        <div className='flex flex-row gap-2'>
          <div className='font-medium text-lg text-neutral-700'>
            Winner: {results.winner}
          </div>
          <div className='font-medium text-lg text-neutral-700'>
            Bid Amount: {results.bidAmount}
          </div>
        </div>
      ) : null}
    </div>
  );
};
