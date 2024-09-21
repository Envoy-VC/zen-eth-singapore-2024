'use client';

import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
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

import { SendHorizonalIcon, Trash2Icon } from 'lucide-react';

const postSchema = z.object({
  question: z.string(),
  options: z.array(z.object({ option: z.string() })).min(2),
});

type PostType = z.infer<typeof postSchema>;

export const PollPost = () => {
  const form = useForm<PostType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      question: '',
    },
  });

  const arrayActions = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const onSubmit = (values: PostType) => {
    console.log(values);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a new Poll?</DialogTitle>
        <DialogDescription>
          <Form {...form}>
            <form className='space-y-3' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='question'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder='Question...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-1'>
                  {arrayActions.fields.map((item, index) => (
                    <div
                      key={item.id}
                      className='flex flex-row items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2'
                    >
                      <FormField
                        control={form.control}
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- zod register
                        name={`options.${index}.option`}
                        render={({ field }) => (
                          <FormItem className='w-full'>
                            <FormControl>
                              <Input
                                className='border-none outline-none'
                                placeholder='Field Name'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        className='m-0 flex h-8 w-8 justify-start p-0'
                        type='button'
                        variant='ghost'
                        onClick={() => arrayActions.remove(index)}
                      >
                        <Trash2Icon size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  className='w-full text-start'
                  type='button'
                  variant='secondary'
                  onClick={() => {
                    arrayActions.append({
                      option: '',
                    });
                  }}
                >
                  Add Option
                </Button>
              </div>
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
