'use client';

/* eslint-disable @next/next/no-img-element -- safe */
import { fetcher } from '~/lib/graphql';
import { PROFILES_BY_TOKEN_ID_QUERY } from '~/lib/queries';

import { useQuery } from '@tanstack/react-query';

import { AspectRatio } from '~/components/ui/aspect-ratio';

import { UserDetails, UserFeed } from '../_components';

const UserProfile = ({ params }: { params: { userId: string } }) => {
  const { data } = useQuery({
    queryKey: ['user', params.userId],
    queryFn: async () => {
      const res = (await fetcher(
        PROFILES_BY_TOKEN_ID_QUERY(params.userId)
      )) as {
        data: {
          allProfileCreateds: {
            nodes: {
              handleLocalName: string;
              handleNamespace: string;
              owner: string;
              tokenId: string;
            }[];
          };
        };
      };
      return res.data.allProfileCreateds.nodes[0] ?? null;
    },
    // refetchInterval: 1500,
  });

  if (data)
    return (
      <div className='mx-auto flex w-full max-w-screen-xl flex-col'>
        <AspectRatio className='overflow-hidden rounded-b-2xl' ratio={3.5}>
          <img
            alt=''
            className='object-cover'
            src='https://img.freepik.com/free-vector/flat-design-japanese-wave-pattern-illustration_23-2149478626.jpg?t=st=1713666840~exp=1713670440~hmac=285ca8f54610242f61773fe583087d2a33a4f2588ff28746bfd1c46317118155&w=2000'
          />
        </AspectRatio>
        <div className='flex flex-col items-start md:flex-row'>
          <div className='w-full basis-1/3'>
            {params.userId}
            <UserDetails {...data} />
          </div>
          <div className='w-full basis-2/3'>
            <UserFeed />
          </div>
        </div>
      </div>
    );
};

export default UserProfile;
