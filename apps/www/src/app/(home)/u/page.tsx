'use client';

import Link from 'next/link';

import React from 'react';

import { fetcher } from '~/lib/graphql';
import { ALL_PROFILES_QUERY } from '~/lib/queries';

import { useQuery } from '@tanstack/react-query';
import Avvvatars from 'avvvatars-react';

import { Avatar } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';

import { ExternalLinkIcon } from 'lucide-react';

const Profiles = () => {
  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const res = (await fetcher(ALL_PROFILES_QUERY)) as {
        data: {
          allProfileCreateds: {
            nodes: {
              tokenId: string;
              owner: string;
              handleNamespace: string;
              handleLocalName: string;
            }[];
          };
        };
      };

      return res.data.allProfileCreateds.nodes;
    },
  });
  return (
    <div className='mx-auto flex max-w-screen-xl flex-row flex-wrap gap-4 py-24'>
      {profiles?.map((profile) => (
        <ProfileCard key={profile.tokenId} {...profile} />
      ))}
    </div>
  );
};

const ProfileCard = ({
  tokenId,
  owner,
  handleLocalName,
  handleNamespace,
}: {
  tokenId: string;
  owner: string;
  handleNamespace: string;
  handleLocalName: string;
}) => {
  return (
    <div className='flex w-full max-w-[14rem] flex-col items-center justify-center rounded-3xl bg-neutral-100 py-8 gap-4'>
      <Avatar className='h-full max-h-[7rem] w-full max-w-[7rem] rounded-xl'>
        <Avvvatars
          size={112}
          style='shape'
          value={`${handleLocalName}.${handleNamespace}`}
        />
      </Avatar>
      <div className='font-bold text-xl sm:text-2xl'>
        {handleLocalName}.{handleNamespace}
      </div>
      <Button className='bg-white text-neutral-800'>
        <Link
          className='flex flex-row items-center gap-2'
          href={`/u/${tokenId}`}
        >
          Go to Profile <ExternalLinkIcon className='text-neutral-600' />
        </Link>
      </Button>
    </div>
  );
};

export default Profiles;
