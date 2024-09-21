import Image from 'next/image';

import React from 'react';

import { cn } from '~/lib/utils';

interface LogoProps {
  width: number;
  height: number;
  className?: string;
}

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <Image
      alt='Logo'
      className={cn('h-fit', className)}
      src='/icon.png'
      {...props}
    />
  );
};
