'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Input } from '~/components/ui/input';

import { Logo } from '../icons';
import { Button } from '../ui/button';
import { ConnectButton } from './connect-button';

import { Search } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <div className='fixed left-0 top-0 z-[2] hidden w-full border-b-2 bg-white dark:bg-black sm:flex'>
      <div className='mx-auto flex w-full max-w-screen-xl items-center justify-between gap-2 px-8 py-3'>
        <div className='flex flex-row items-center gap-4'>
          <Logo height={38} width={38} />
          <div className='flex flex-row items-center gap-1 rounded-xl border px-3 py-2'>
            <Search className='text-neutral-500' size={20} />
            <Input
              className='h-5 w-full max-w-[8rem] border-none ring-0'
              placeholder='Search...'
            />
          </div>
          {NavItems.map((item) => (
            <Button
              key={item.title}
              asChild
              className='h-9 font-medium !text-sm'
              variant={pathname === item.href ? 'secondary' : 'ghost'}
            >
              <Link href={item.href}>{item.title}</Link>
            </Button>
          ))}
        </div>
        <div className='flex flex-row items-center gap-3'>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

const NavItems = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Discover',
    href: '/u',
  },
  {
    title: 'Claim Handle',
    href: '/claim',
  },
];
