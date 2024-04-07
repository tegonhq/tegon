/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function AssigneeLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_150_164)">
        <rect
          x="1.5"
          y="1.5"
          width="17"
          height="17"
          rx="3.5"
          stroke={color ? color : 'currentColor'}
          strokeDasharray="1 1"
        />
        <path
          d="M5.5 19C5.5 16.4753 7.5483 14.4286 10.075 14.4286C12.6017 14.4286 14.65 16.4753 14.65 19H5.5ZM10.075 13.8571C8.17924 13.8571 6.64375 12.3229 6.64375 10.4286C6.64375 8.53429 8.17924 7 10.075 7C11.9708 7 13.5063 8.53429 13.5063 10.4286C13.5063 12.3229 11.9708 13.8571 10.075 13.8571Z"
          fill={color ? color : 'currentColor'}
        />
      </g>
      <rect
        x="1.5"
        y="1.5"
        width="17"
        height="17"
        rx="3.5"
        stroke={color ? color : 'currentColor'}
        strokeDasharray="1 1"
      />
      <defs>
        <clipPath id="clip0_150_164">
          <rect x="1" y="1" width="18" height="18" rx="4" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
