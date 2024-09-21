import React, { useState } from 'react';

import { encryptVoteOption } from '~/lib/helpers';
import { usePermissions } from '~/lib/hooks';
import { getJSON } from '~/lib/storage';
import { cn } from '~/lib/utils';
import {
  pollModuleConfig,
  profileContractConfig,
  wagmiConfig,
} from '~/lib/viem';

import { useQuery } from '@tanstack/react-query';
import { readContract } from '@wagmi/core';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

import { Button } from '../ui/button';

interface PollCardProps {
  content: string;
  deadline: string;
  noOfOptions: number;
  pollId: string;
  tokenId: string;
}

export const PollCard = (props: PollCardProps) => {
  const { address } = useAccount();
  const { getPermit, unsealResponse } = usePermissions();
  const { data: owner } = useReadContract({
    abi: profileContractConfig.abi,
    address: profileContractConfig.address as `0x${string}`,
    functionName: 'ownerOf',
    args: [BigInt(props.tokenId)],
  });
  const { data: poll } = useQuery({
    queryKey: [props.pollId, props.tokenId],
    queryFn: async () => {
      const res = (await getJSON(props.content)) as {
        question: string;
        options: { option: string }[];
      };
      return res;
    },
  });

  const { writeContractAsync } = useWriteContract();

  const voteFOrPoll = async (option: number) => {
    const eOption = await encryptVoteOption(option);
    await writeContractAsync({
      abi: pollModuleConfig.abi,
      address: pollModuleConfig.address as `0x${string}`,
      functionName: 'voteForPoll',
      args: [
        BigInt(props.tokenId),
        BigInt(props.pollId),
        eOption as {
          data: `0x${string}`;
        },
      ],
    });
  };

  const [selectedOption, setSelectedOption] = useState<number>(0);

  const endPoll = async () => {
    await writeContractAsync({
      abi: pollModuleConfig.abi,
      address: pollModuleConfig.address as `0x${string}`,
      functionName: 'endPoll',
      args: [BigInt(props.tokenId), BigInt(props.pollId)],
    });
  };
  const [results, setResults] = useState<number[]>([]);

  const getResults = async () => {
    const permit = await getPermit(pollModuleConfig.address as `0x${string}`);
    const results = await readContract(wagmiConfig, {
      abi: pollModuleConfig.abi,
      address: pollModuleConfig.address as `0x${string}`,
      functionName: 'getPollResults',
      args: [
        BigInt(props.tokenId),
        BigInt(props.pollId),
        {
          publicKey: permit.publicKey as `0x${string}`,
          signature: permit.signature as `0x${string}`,
        },
      ],
    });
    const votes = [];
    for await (const result of results) {
      votes.push(
        Number(
          await unsealResponse(
            result,
            pollModuleConfig.address as `0x${string}`
          )
        )
      );
    }

    const totalVotes = votes.reduce((acc, vote) => acc + vote, 0);

    const percentages = votes.map((vote) => {
      const percent = (vote / totalVotes) * 100;
      return percent;
    });

    setResults(percentages);
  };
  return (
    <div className='flex flex-col gap-5 rounded-2xl bg-neutral-200 px-3 py-5'>
      <div className='font-neutral-400 font-medium text-2xl'>
        {poll?.question}
      </div>
      <div className='flex flex-col gap-1'>
        {poll?.options.map((option, index) => {
          return (
            <div
              key={option.option}
              className='flex flex-row items-center gap-2'
            >
              <Button
                className='flex w-full flex-row items-center justify-between !rounded-2xl bg-white px-4 !text-lg text-neutral-700'
                onClick={() => setSelectedOption(index)}
              >
                <div className='flex flex-row items-center gap-3'>
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full bg-neutral-300',
                      selectedOption === index
                        ? 'bg-blue-500'
                        : 'bg-neutral-300'
                    )}
                  />
                  {option.option}
                </div>
                <div className='font-semibold text-sm'>
                  {results[index] ? `${results[index].toFixed(2)}%` : ''}
                </div>
              </Button>
            </div>
          );
        })}
      </div>
      <div className='flex flex-row justify-between gap-4 px-4'>
        <div className='flex flex-row items-center gap-4'>
          {owner?.toLowerCase() === address?.toLowerCase() && (
            <Button className='!text-lg' onClick={async () => await endPoll()}>
              End Poll
            </Button>
          )}
          <Button className='!text-lg' onClick={async () => await getResults()}>
            View Results
          </Button>
        </div>
        <Button
          className='!text-lg'
          onClick={async () => await voteFOrPoll(selectedOption)}
        >
          Vote
        </Button>
      </div>
    </div>
  );
};
