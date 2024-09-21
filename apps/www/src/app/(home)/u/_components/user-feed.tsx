import { fetcher } from '~/lib/graphql';
import { POLLS_BY_TOKEN_ID_QUERY } from '~/lib/queries';
import { profileContractConfig } from '~/lib/viem';

import { useQuery } from '@tanstack/react-query';
import { useAccount, useReadContract } from 'wagmi';
import { PostBox } from '~/components';

import { PollCard } from '~/components/cards/poll';
import { Button } from '~/components/ui/button';

import { Rss } from 'lucide-react';

interface UserFeedProps {
  handleLocalName: string;
  handleNamespace: string;
  owner: string;
  tokenId: string;
}

export const UserFeed = (props: UserFeedProps) => {
  const { address } = useAccount();
  const { data: polls } = useQuery({
    queryKey: [props.tokenId, 'polls'],
    queryFn: async () => {
      const res = (await fetcher(POLLS_BY_TOKEN_ID_QUERY(props.tokenId))) as {
        data: {
          allPollCreateds: {
            nodes: {
              content: string;
              deadline: string;
              noOfOptions: number;
              pollId: string;
              tokenId: string;
            }[];
          };
        };
      };

      return res.data.allPollCreateds.nodes;
    },
  });

  const { data: ownerOf } = useReadContract({
    abi: profileContractConfig.abi,
    address: profileContractConfig.address as `0x${string}`,
    functionName: 'ownerOf',
    args: [BigInt(props.tokenId)],
    query: {
      refetchInterval: 1500,
    },
  });
  return (
    <div className='flex flex-col gap-2 sm:py-12'>
      {ownerOf?.toLowerCase() === address?.toLowerCase() && (
        <PostBox {...props} />
      )}
      <Button
        className='mx-3 flex h-8 w-fit flex-row items-center gap-2 font-medium text-sm sm:mx-0'
        variant='outline'
      >
        <Rss className='mb-1' size={16} strokeWidth={2.5} />
        Feed
      </Button>
      <div className='sm:order-l bg-background-secondary border-b border-t sm:rounded-xl sm:border-r'>
        <div className='flex flex-col gap-4'>
          {polls?.map((poll) => {
            return <PollCard key={poll.pollId} {...poll} />;
          })}
        </div>
      </div>
    </div>
  );
};
