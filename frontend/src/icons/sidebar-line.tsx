/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function SidebarLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_154_269)">
        <rect
          x="2"
          y="2"
          width="6"
          height="16"
          fill={color ? color : 'currentColor'}
          stroke={color ? color : 'currentColor'}
          stroke-width="2"
        />
        <path
          d="M9 2H8V3V17V18H9H17H18V17V3V2H17H9Z"
          stroke={color ? color : 'currentColor'}
          stroke-width="2"
        />
      </g>
      <rect
        x="2"
        y="2"
        width="16"
        height="16"
        rx="3"
        stroke={color ? color : 'currentColor'}
        stroke-width="2"
      />
      <defs>
        <clipPath id="clip0_154_269">
          <rect x="1" y="1" width="18" height="18" rx="4" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
