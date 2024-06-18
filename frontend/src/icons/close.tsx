/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function Close({ size = 16, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.0258 2.96985C13.3187 3.26275 13.3187 3.73762 13.0258 4.03051L9.0584 7.99794L13.0258 11.9654C13.3187 12.2582 13.3187 12.7331 13.0258 13.026C12.7329 13.3189 12.258 13.3189 11.9652 13.026L7.99774 9.0586L4.03034 13.026C3.73745 13.3189 3.26258 13.3189 2.96968 13.026C2.67679 12.7331 2.67679 12.2582 2.96968 11.9653L6.93708 7.99794L2.96967 4.03053C2.67678 3.73763 2.67678 3.26276 2.96967 2.96987C3.26256 2.67697 3.73744 2.67697 4.03033 2.96987L7.99774 6.93728L11.9652 2.96985C12.2581 2.67696 12.7329 2.67696 13.0258 2.96985Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
