'use client';

import Image from 'next/image';

import React from 'react';

import BackgroundImage from 'public/Zen Background.png';

import { Logo } from '~/components/icons';
import { RegisterForm } from '~/components/register-form';

const ClaimPage = () => {
  return (
    <div className='flex w-full flex-row'>
      <div className='flex w-full basis-1/2 flex-col'>
        <div className='hidden w-full border-b-2 bg-white dark:bg-black sm:flex'>
          <div className='mx-auto flex w-full max-w-screen-xl items-center justify-between gap-2 px-8 py-3'>
            <div className='flex w-full flex-row items-center justify-between gap-4'>
              <Logo height={38} width={38} />
              <w3m-button />
            </div>
          </div>
        </div>
        <div className='mx-auto my-24 w-full max-w-lg py-24'>
          <div className='flex flex-col gap-4'>
            <div className='mx-auto my-3 font-semibold text-3xl'>
              Mint your Zen Handle
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className='flex w-full basis-1/2'>
        <Image
          alt='Background'
          className='h-screen w-full object-cover opacity-70'
          height={1080}
          src={BackgroundImage}
          style={{ filter: 'brightness(0.5)' }}
          width={1920}
        />
      </div>
    </div>
  );
};

export default ClaimPage;
