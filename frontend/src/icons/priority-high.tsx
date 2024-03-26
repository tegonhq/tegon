/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function PriorityHigh({ size = 18, className }: IconProps) {
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
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
      />
      <path
        d="M10 9V17"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
      />
      <path
        d="M17 3L17 17"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
  );
}
