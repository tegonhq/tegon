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
          x="2"
          y="2"
          width="16"
          height="16"
          rx="3"
          stroke={color ? color : 'currentColor'}
          stroke-width="2"
          stroke-dasharray="2 2"
        />
        <path
          d="M5.5 17C5.5 14.4753 7.5483 12.4286 10.075 12.4286C12.6017 12.4286 14.65 14.4753 14.65 17H5.5ZM10.075 11.8571C8.17924 11.8571 6.64375 10.3229 6.64375 8.42857C6.64375 6.53429 8.17924 5 10.075 5C11.9708 5 13.5063 6.53429 13.5063 8.42857C13.5063 10.3229 11.9708 11.8571 10.075 11.8571Z"
          fill={color ? color : 'currentColor'}
        />
      </g>
      <rect
        x="1.5"
        y="1.5"
        width="17"
        height="17"
        rx="3.5"
        stroke="currentColor"
        stroke-dasharray="2 2"
      />
      <defs>
        <clipPath id="clip0_150_164">
          <rect x="1" y="1" width="18" height="18" rx="4" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
