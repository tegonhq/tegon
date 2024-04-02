/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function DuplicateLine2({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="6"
        width="12"
        height="12"
        rx="2.11"
        stroke={color ? color : 'currentColor'}
        stroke-width="2"
      />
      <path
        d="M5 6.64286V5.11C5 3.39239 6.39239 2 8.11 2H14.89C16.6076 2 18 3.39239 18 5.11V11.89C18 13.6076 16.6076 15 14.89 15H13.3571"
        stroke={color ? color : 'currentColor'}
        stroke-width="2"
      />
    </svg>
  );
}
