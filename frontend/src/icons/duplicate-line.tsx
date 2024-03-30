/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function DuplicateLine({ size = 18, className, color }: IconProps) {
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
        y="5.55554"
        width="12.4444"
        height="12.4444"
        rx="3.11"
        fill={color ? color : 'currentColor'}
      />
      <rect
        x="6.55554"
        y="3"
        width="10.4444"
        height="10.4444"
        rx="2.11"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
