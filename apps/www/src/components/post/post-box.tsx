'use client';

import React, { useState } from 'react';

import { Dialog, DialogTrigger } from '~/components/ui/dialog';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PollPost } from './poll-post';
import { TextPost } from './text-post';

import { ImageIcon, ReceiptIcon, SmileIcon, VoteIcon } from 'lucide-react';
import { AuctionPost } from './auction-post';

interface PostBoxProps {
  handleLocalName: string;
  handleNamespace: string;
  owner: string;
  tokenId: string;
}

export const PostBox = (props: PostBoxProps) => {
  const [postType, setPostType] = useState<'text' | 'poll' | 'auction' | null>(
    null
  );

  return (
    <div>
      <div className='flex flex-col rounded-2xl border py-1'>
        <Input
          className='m-[2px] h-9 rounded-xl border-none ring-0'
          placeholder={`What's on your mind?`}
          onClick={() => setPostType('text')}
        />
        <div className='flex flex-row gap-3 px-2'>
          <Dialog
            open={postType === 'text'}
            onOpenChange={(open) => {
              if (open) {
                setPostType('text');
              } else {
                setPostType(null);
              }
            }}
          >
            <DialogTrigger>
              <Button className='h-9 w-9 p-0 text-neutral-500' variant='ghost'>
                <ImageIcon size={20} />
              </Button>
            </DialogTrigger>
            <TextPost {...props} />
          </Dialog>
          <Dialog
            open={postType === 'text'}
            onOpenChange={(open) => {
              if (open) {
                setPostType('text');
              } else {
                setPostType(null);
              }
            }}
          >
            <DialogTrigger>
              <Button className='h-9 w-9 p-0 text-neutral-500' variant='ghost'>
                <SmileIcon size={20} />
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog
            open={postType === 'poll'}
            onOpenChange={(open) => {
              if (open) {
                setPostType('poll');
              } else {
                setPostType(null);
              }
            }}
          >
            <DialogTrigger>
              <Button className='h-9 w-9 p-0 text-neutral-500' variant='ghost'>
                <VoteIcon size={20} />
              </Button>
            </DialogTrigger>
            <PollPost {...props} />
          </Dialog>
          <Dialog
            open={postType === 'auction'}
            onOpenChange={(open) => {
              if (open) {
                setPostType('auction');
              } else {
                setPostType(null);
              }
            }}
          >
            <DialogTrigger>
              <Button className='h-9 w-9 p-0 text-neutral-500' variant='ghost'>
                <ReceiptIcon size={20} />
              </Button>
            </DialogTrigger>
            <AuctionPost {...props} />
          </Dialog>
        </div>
      </div>
    </div>
  );
};
