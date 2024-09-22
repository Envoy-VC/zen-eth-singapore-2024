/* eslint-disable @next/next/no-img-element -- safe */
import React from 'react';
import { useForm } from 'react-hook-form';

import { uploadFile, uploadJSON } from '~/lib/storage';
import { cn } from '~/lib/utils';
import { auctionModuleConfig, wagmiConfig } from '~/lib/viem';

import { zodResolver } from '@hookform/resolvers/zod';
import { waitForTransactionReceipt } from '@wagmi/core';
import { toast } from 'sonner';
import { useWriteContract } from 'wagmi';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';

import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

import { ImageIcon, SendHorizonalIcon } from 'lucide-react';

interface AuctionPostProps {
  handleLocalName: string;
  handleNamespace: string;
  owner: string;
  tokenId: string;
}

const auctionSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.instanceof(FileList).optional(),
  startPrice: z.number(),
});

type AuctionType = z.infer<typeof auctionSchema>;

export const AuctionPost = (props: AuctionPostProps) => {
  const { writeContractAsync } = useWriteContract();
  const form = useForm<AuctionType>({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      name: '',
      description: '',
      startPrice: 1000,
    },
  });

  const onSubmit = async (values: AuctionType) => {
    console.log(values);
    let fileCid = '';
    if (values.image?.[0]) {
      const file = values.image[0];
      const abf = await file.arrayBuffer();
      fileCid = await uploadFile(abf);
    }
    const content = {
      name: values.name,
      description: values.description,
      imageCID: fileCid,
    };
    const contentCID = await uploadJSON(content);
    const startTime = Math.round(Date.now() / 1000);
    const endTime = startTime + 24 * 60 * 60; // 1 day
    const hash = await writeContractAsync({
      abi: auctionModuleConfig.abi,
      address: auctionModuleConfig.address as `0x${string}`,
      functionName: 'createAuction',
      args: [
        BigInt(props.tokenId),
        contentCID,
        BigInt(values.startPrice),
        BigInt(startTime),
        BigInt(endTime),
      ],
    });
    await waitForTransactionReceipt(wagmiConfig, { hash });
    toast.success('Auction Created Successfully');
    form.reset();
  };

  const fileRef = form.register('image');
  const file = form.watch('image');

  return (
    <div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Auction</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                className='space-y-3'
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder='Name of Product...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder='Write a description about the product'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='startPrice'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Starting Price'
                          type='number'
                          {...field}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='image'
                  render={() => {
                    return (
                      <FormItem className='h-10'>
                        <Button
                          className='h-9 w-9 p-0 text-neutral-500'
                          type='button'
                          variant='ghost'
                          onClick={() => {
                            document.getElementById('text-post-file')?.click();
                          }}
                        >
                          <ImageIcon size={20} />
                        </Button>
                        <FormControl>
                          <Input
                            accept='image/*'
                            type='file'
                            {...fileRef}
                            className='invisible'
                            id='text-post-file'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {file ? (
                  <img
                    alt='file'
                    src={URL.createObjectURL(file.item(0) ?? new Blob([]))}
                    className={cn(
                      'h-[24rem] w-full rounded-xl object-cover',
                      file.item(0) ? '' : 'hidden'
                    )}
                  />
                ) : null}
                <div className='flex w-full justify-end'>
                  <Button className='h-8 w-8 p-2' type='submit'>
                    <SendHorizonalIcon className='h-8 w-8 !p-0' />
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </div>
  );
};
