/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function CheckLine({ size = 16, className, color }: IconProps) {
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
        d="M14.0308 3.46976C14.3236 3.76271 14.3236 4.23758 14.0306 4.53042L6.52802 12.0304C6.2351 12.3232 5.7603 12.3232 5.46744 12.0303L2.47198 9.03479C2.17909 8.74189 2.1791 8.26702 2.472 7.97413C2.76489 7.68124 3.23977 7.68124 3.53266 7.97414L5.99788 10.4394L12.9701 3.46958C13.2631 3.17674 13.7379 3.17682 14.0308 3.46976Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
