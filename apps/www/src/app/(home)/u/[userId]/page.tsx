/* eslint-disable @next/next/no-img-element -- safe */
import { AspectRatio } from '~/components/ui/aspect-ratio';

import { UserDetails, UserFeed } from '../_components';

const UserProfile = () => {
  return (
    <div className='mx-auto flex w-full max-w-screen-xl flex-col'>
      <AspectRatio className='overflow-hidden rounded-b-2xl' ratio={3.5}>
        <img
          alt=''
          className='object-cover'
          src='https://img.freepik.com/free-vector/flat-design-japanese-wave-pattern-illustration_23-2149478626.jpg?t=st=1713666840~exp=1713670440~hmac=285ca8f54610242f61773fe583087d2a33a4f2588ff28746bfd1c46317118155&w=2000'
        />
      </AspectRatio>
      <div className='flex flex-col items-start md:flex-row'>
        <div className='w-full basis-1/3'>
          <UserDetails />
        </div>
        <div className='w-full basis-2/3'>
          <UserFeed />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
