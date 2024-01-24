/** Copyright (c) 2024, Tegon, all rights reserved. **/

import dynamic from 'next/dynamic';

export const Logo = dynamic(() => import('./logo'), {
  ssr: false,
});
