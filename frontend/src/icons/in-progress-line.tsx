/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function InProgressLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 10C1 14.9705 5.02944 19 10 19C14.9705 19 19 14.9705 19 10C19 5.02944 14.9705 1 10 1C5.02944 1 1 5.02944 1 10ZM17.2 10C17.2 13.9765 13.9765 17.2 10 17.2C6.02355 17.2 2.8 13.9765 2.8 10C2.8 6.02355 6.02355 2.8 10 2.8C13.9765 2.8 17.2 6.02355 17.2 10ZM15.4 10C15.4 12.8139 13.2477 15.1251 10.4996 15.3772C10.2246 15.4024 10 15.1761 10 14.9V5.1C10 4.82386 10.2246 4.59758 10.4996 4.6228C13.2477 4.87489 15.4 7.1861 15.4 10Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
