/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function NoPriorityLine({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.25 8C2.25 7.58579 2.58579 7.25 3 7.25H13C13.4142 7.25 13.75 7.58579 13.75 8C13.75 8.41421 13.4142 8.75 13 8.75H3C2.58579 8.75 2.25 8.41421 2.25 8Z"
        fill="currentColor"
      />
    </svg>
  );
}
