/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function TeamLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_116_75)">
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
          d="M4 19C4 16.4753 6.0483 14.4286 8.575 14.4286C11.1017 14.4286 13.15 16.4753 13.15 19H4ZM8.575 13.8571C6.67924 13.8571 5.14375 12.3229 5.14375 10.4286C5.14375 8.53429 6.67924 7 8.575 7C10.4708 7 12.0063 8.53429 12.0063 10.4286C12.0063 12.3229 10.4708 13.8571 8.575 13.8571ZM12.7856 15.1333C14.5501 15.5838 15.8766 17.1277 16 19H14.2938C14.2938 17.5087 13.722 16.1508 12.7856 15.1333ZM11.6289 13.8325C12.5626 12.9955 13.15 11.7806 13.15 10.4286C13.15 9.61866 12.9392 8.85795 12.5695 8.19821C13.8793 8.45941 14.8656 9.61409 14.8656 11C14.8656 12.5786 13.5861 13.8571 12.0063 13.8571C11.8783 13.8571 11.7523 13.8487 11.6289 13.8325Z"
          fill={color ? color : 'currentColor'}
        />
      </g>
      <defs>
        <clipPath id="clip0_116_75">
          <rect x="1" y="1" width="18" height="18" rx="4" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
