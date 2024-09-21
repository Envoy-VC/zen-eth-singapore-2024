'use client';

import { Logo } from './icons';

export const Header = () => {
  return (
    <div className='hidden h-[60dvh] sm:flex'>
      <div className='mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 py-36 pb-24'>
        <div className='flex w-full flex-col items-center justify-center gap-5'>
          <Logo height={160} width={160} />
          <div className='flex flex-col items-center justify-center font-bold text-[2.75rem] leading-[1.05]'>
            <h1>Welcome to zen,</h1>
            <h1 className='text-[#71717A] dark:text-white'>
              your social space, <br />
              Protected by FHE.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
