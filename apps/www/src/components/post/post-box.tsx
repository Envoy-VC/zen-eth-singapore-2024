'use client';

import React from 'react';

import { Input } from '../ui/input';

export const PostBox = () => {
  return (
    <div>
      <div className='flex flex-col rounded-2xl border'>
        <Input
          className='m-[2px] h-9 rounded-xl border-none ring-0'
          placeholder={`What's on your mind?`}
          onClick={() => console.log('Search your Zen Handle')}
        />
      </div>
    </div>
  );
};
