/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function TodoLine({ size = 18, className, color }: IconProps) {
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
        x="1.9"
        y="1.9"
        width="16.2"
        height="16.2"
        rx="8.1"
        stroke="currentColor"
        stroke-width="1.8"
      />
    </svg>
  );
}
