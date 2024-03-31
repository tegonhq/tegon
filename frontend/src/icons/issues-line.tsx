/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function IssuesLine({ size = 18, className, color }: IconProps) {
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
        rx="5"
        stroke={color ? color : 'currentColor'}
        stroke-width="2"
      />
      <path
        d="M9.10343 10.4118C8.91247 10.6028 8.60437 10.6076 8.40754 10.4227L7.42757 9.50213C7.03317 9.13164 6.4156 9.14209 6.03396 9.52571L6.0035 9.55634C5.6147 9.94716 5.61552 10.5789 6.00533 10.9687L7.70009 12.6635C8.28588 13.2493 9.23563 13.2493 9.82141 12.6635L13.9929 8.49195C14.3835 8.10143 14.3835 7.46827 13.993 7.07774L13.9223 7.00712C13.5318 6.61659 12.8986 6.61659 12.5081 7.00712L9.10343 10.4118Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
