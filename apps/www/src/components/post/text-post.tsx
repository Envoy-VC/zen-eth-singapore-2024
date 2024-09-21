'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { encryptPrivateData } from '~/lib/helpers';
import { uploadFile, uploadJSON } from '~/lib/storage';
import { cn } from '~/lib/utils';
import { publicationModuleConfig } from '~/lib/viem';

import { zodResolver } from '@hookform/resolvers/zod';
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

/* eslint-disable @next/next/no-img-element -- safe */

const postSchema = z.object({
  content: z.string(),
  file: z.instanceof(FileList).optional(),
});

type PostType = z.infer<typeof postSchema>;

interface TextPostProps {
  handleLocalName: string;
  handleNamespace: string;
  owner: string;
  tokenId: string;
}

export const TextPost = (props: TextPostProps) => {
  const { writeContractAsync } = useWriteContract();

  const form = useForm<PostType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (values: PostType) => {
    let fileCid = '';
    if (values.file?.[0]) {
      const file = values.file[0];
      const abf = await file.arrayBuffer();
      fileCid = await uploadFile(abf);
    }
    const data = {
      content: values.content,
      fileCid,
    };
    const cid = await uploadJSON(data);
    // todo
    const eData = await encryptPrivateData('124');

    const tokenId = BigInt(props.tokenId);

    await writeContractAsync({
      abi: publicationModuleConfig.abi,
      address: publicationModuleConfig.address as `0x${string}`,
      functionName: 'createPublication',
      args: [
        tokenId,
        0,
        eData as { data: `0x${string}` },
        { publicationId: BigInt(0), tokenId: BigInt(0) },
        [],
      ],
    });
    console.log(values);
  };

  const fileRef = form.register('file');
  const file = form.watch('file');

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>What&apos;s on your mind?</DialogTitle>
        <DialogDescription>
          <Form {...form}>
            <form className='space-y-3' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder='Write a post...' {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='file'
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
  );
};
