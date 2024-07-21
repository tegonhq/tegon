import dynamic from 'next/dynamic';

export const Logo = dynamic(() => import('./logo'), {
  ssr: false,
});
