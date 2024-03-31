/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function BacklogLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.0054 1.00006V3.01607C14.1146 3.4611 16.5714 5.93949 16.9866 9.06114H19.0004C18.5649 4.83501 15.2217 1.46689 11.0054 1.00006ZM9.00537 3.01453V0.998871C4.78398 1.46114 1.43544 4.83141 0.999512 9.06114H3.01335C3.42905 5.93588 5.89102 3.45537 9.00537 3.01453ZM9.00537 16.9855V19.0012C4.82473 18.5433 1.50018 15.2334 1.01295 11.0611H3.0307C3.49355 14.1287 5.93174 16.5504 9.00537 16.9855ZM11.0054 19V16.984C14.0739 16.5447 16.5069 14.1251 16.9692 11.0611H18.987C18.5002 15.2298 15.1809 18.5376 11.0054 19Z"
          fill={color ? color : 'currentColor'}
        />
      </g>
    </svg>
  );
}
