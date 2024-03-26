/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function IssuesLine({ size = 18, className }: IconProps) {
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
        y="2"
        width="16"
        height="16"
        rx="3"
        stroke="currentColor"
        stroke-width="2"
      />
      <path
        d="M8.80338 10.1118C8.61242 10.3028 8.30433 10.3076 8.10749 10.1227L7.12752 9.20213C6.73312 8.83164 6.11555 8.84209 5.73391 9.22571L5.70345 9.25634C5.31465 9.64715 5.31547 10.2789 5.70528 10.6687L7.40005 12.3635C7.98583 12.9493 8.93558 12.9493 9.52137 12.3635L13.6929 8.19195C14.0834 7.80142 14.0834 7.16826 13.6929 6.77774L13.6223 6.70712C13.2318 6.31659 12.5986 6.31659 12.2081 6.70712L8.80338 10.1118Z"
        fill="currentColor"
      />
    </svg>
  );
}
