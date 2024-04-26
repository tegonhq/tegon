/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function BarFill({ size = 18, className, color }: IconProps) {
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
        d="M3 13L3 17"
        stroke={color ? color : 'currentColor'}
        stroke-width="4"
        stroke-linecap="round"
      />
      <path
        d="M10 3L10 17"
        stroke={color ? color : 'currentColor'}
        stroke-width="4"
        stroke-linecap="round"
      />
      <path
        d="M17 9V17"
        stroke={color ? color : 'currentColor'}
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
  );
}
