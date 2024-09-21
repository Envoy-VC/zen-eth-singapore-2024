import React, { type PropsWithChildren } from 'react';

import { Navbar } from '~/components';

const HomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default HomeLayout;
