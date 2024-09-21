'use client';

import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { cn } from '~/lib/utils';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';

import { ArrowRightIcon, Trash2Icon, UserIcon } from 'lucide-react';

/* eslint-disable @next/next/no-img-element -- safe */

const registerSchema = z.object({
  name: z.string(),
  profilePicture: z.instanceof(FileList).optional(),
  privateFields: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    })
  ),
});

type RegisterType = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (values: RegisterType) => {
    console.log(values);
  };

  const fileRef = form.register('profilePicture');
  const file = form.watch('profilePicture');

  const arrayActions = useFieldArray({
    control: form.control,
    name: 'privateFields',
  });

  return (
    <Form {...form}>
      <form className='space-y-3' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='profilePicture'
          render={() => {
            return (
              <FormItem className='mx-auto h-[12rem] w-[12rem]'>
                <Button
                  className='h-[12rem] w-[12rem] rounded-full p-0 text-neutral-500'
                  variant='ghost'
                  onClick={() => {
                    document.getElementById('text-post-file')?.click();
                  }}
                >
                  {file?.item(0) ? (
                    <img
                      alt='file'
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe
                      src={URL.createObjectURL(file.item(0)!)}
                      className={cn(
                        'aspect-square h-[12rem] w-full rounded-full object-cover'
                      )}
                    />
                  ) : (
                    <UserIcon className='text-neutral-500' size={128} />
                  )}
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
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <div className='flex flex-row rounded-2xl border'>
                <FormControl>
                  <Input
                    className='m-[2px] h-9 rounded-2xl border-none ring-0'
                    placeholder='Search your Zen Handle'
                    {...field}
                  />
                </FormControl>
                <Button
                  className='h-10 w-20 rounded-l-2xl rounded-r-2xl px-0'
                  type='button'
                  variant='ghost'
                >
                  <ArrowRightIcon className='text-neutral-500' size={20} />
                </Button>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex flex-col gap-3'>
          <div className='my-1 font-medium text-xl'>Private Information</div>
          <div className='flex flex-col gap-1'>
            {arrayActions.fields.map((item, index) => (
              <div
                key={item.id}
                className='flex flex-row items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2'
              >
                <FormField
                  control={form.control}
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- zod register
                  name={`privateFields.${index}.name`}
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
                <FormField
                  control={form.control}
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- zod register
                  name={`privateFields.${index}.value`}
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Input
                          className='border-none outline-none'
                          placeholder='Field Value'
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
                name: '',
                value: '',
              });
            }}
          >
            Add Option
          </Button>
        </div>
        <Button className='w-full text-center' type='submit'>
          Register Handle
        </Button>
      </form>
    </Form>
  );
};
