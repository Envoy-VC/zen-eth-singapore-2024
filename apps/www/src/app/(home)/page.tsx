import React from 'react';

import { Header, Sidebar } from '~/components';

import { PostCard } from '~/components/cards/post';
import { Button } from '~/components/ui/button';

const Home = () => {
  return (
    <div>
      <Header />
      <div className='mx-auto mb-[10dvh] flex w-full max-w-screen-xl flex-row sm:mb-0'>
        <div className='w-full basis-[100%] px-2 lg:basis-2/3'>
          <div className='bg-background-secondary relative mx-auto my-12 flex max-w-screen-md flex-col rounded-xl border'>
            <div className='flex flex-row items-center justify-between px-6 py-2'>
              <div className='text-lg font-semibold'>Feeds</div>
              <div className='flex flex-row items-center gap-2'>
                <Button className='px-2' variant='ghost'>
                  Recent
                </Button>
                <Button className='px-2' variant='ghost'>
                  Popular
                </Button>
              </div>
            </div>
            <div className='flex flex-col'>
              {Array.from({ length: 10 }).map((_, index) => {
                return <PostCard key={index} />;
              })}
            </div>
          </div>
        </div>
        <div className='hidden w-full lg:flex lg:basis-1/3'>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
