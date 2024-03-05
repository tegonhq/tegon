/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { ReactElement } from 'react';

import { Logo } from 'components/dynamic-logo';

interface Props {
  children: React.ReactNode;
}

export function AuthLayout(props: Props): ReactElement {
  const { children } = props;

  return (
    <div className="flex h-screen w-screen flex-col justify-center items-center">
      <div className="pt-8">
        <Logo width={120} height={50} />
      </div>

      <div className="flex-grow flex justify-center items-center h-full">
        {children}
      </div>
    </div>
  );
}
