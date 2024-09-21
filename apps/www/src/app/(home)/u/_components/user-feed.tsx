import { PostBox } from '~/components';

import { PostCard } from '~/components/cards';
import { Button } from '~/components/ui/button';

import { Rss } from 'lucide-react';

export const UserFeed = () => {
  return (
    <div className='flex flex-col gap-2 sm:py-12'>
      <PostBox />
      <Button
        className='mx-3 flex h-8 w-fit flex-row items-center gap-2 text-sm font-medium sm:mx-0'
        variant='outline'
      >
        <Rss className='mb-1' size={16} strokeWidth={2.5} />
        Feed
      </Button>
      <div className='sm:order-l bg-background-secondary border-b border-t sm:rounded-xl sm:border-r'>
        <div className='flex flex-col'>
          {Array.from({ length: 10 }).map((_, index) => {
            return <PostCard key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};
