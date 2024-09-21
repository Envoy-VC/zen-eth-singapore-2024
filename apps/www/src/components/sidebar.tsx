import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

export const Sidebar = () => {
  return (
    <div className='my-10 h-full w-full'>
      <div className='flex w-full flex-col gap-4 p-2'>
        <div className='bg-background-secondary flex w-full flex-col items-center rounded-xl border py-3'>
          <Avatar className='h-full max-h-20 w-full max-w-20 rounded-full'>
            <AvatarImage
              alt='Profile Image'
              loading='lazy'
              src='https://avatars.githubusercontent.com/u/65389981?v=4'
            />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>

          <div className='pt-1 text-lg font-semibold'>Vedant Chainani</div>
          <p>Indie Hacker and Technical Writer</p>
          <div className='flex w-full flex-row items-center gap-1 px-4 py-3'>
            <div className='flex w-full flex-col items-center justify-center'>
              <div className='text-xl font-semibold'>368</div>
              <div>Posts</div>
            </div>
            <div className='flex w-full flex-col items-center justify-center'>
              <div className='text-xl font-semibold'>11.2k</div>
              <div>Followers</div>
            </div>
            <div className='flex w-full flex-col items-center justify-center'>
              <div className='text-xl font-semibold'>2.3k</div>
              <div>Following</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
