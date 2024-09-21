/* eslint-disable @next/next/no-img-element -- safe  */
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

export const PostCard = () => {
  return (
    <div className='flex flex-row items-start gap-2 border-b p-4 hover:bg-[#F4F4F5] dark:hover:bg-[#18181B]'>
      <Avatar className='h-full max-h-10 w-full max-w-10 rounded-full'>
        <AvatarImage
          alt='Profile Image'
          loading='lazy'
          src='https://avatars.githubusercontent.com/u/65389981?v=4'
        />
        <AvatarFallback>VC</AvatarFallback>
      </Avatar>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-row items-center gap-1'>
          <div className='font-medium'>Vedant Chainani</div>
          <div className='text-sm text-[#71717A]'>@envoy1084</div>
          <div className='h-[3px] w-[3px] rounded-full bg-[#71717A]' />
          <div className='text-sm text-[#71717A]'>2h</div>
        </div>
        <p className='whitespace-pre-wrap text-sm sm:text-base'>
          {`A slice of 🍋
Your reminder to touch grass and have something sweet this weekend 🌻`}
        </p>
        <img
          alt='Post'
          className='max-h-[40rem] max-w-[16rem] rounded-lg object-cover sm:max-w-lg'
          src='https://ik.imagekit.io/lens/media-snapshot/tr:w-1000,q-80/2cb3915d130807217f87770c92f6ecccda7bb1677d16f392dea7206380d86a76.jpg'
        />
      </div>
    </div>
  );
};
