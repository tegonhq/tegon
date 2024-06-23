/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function ParentIssueLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 4.66669C14.7364 4.66669 15.3334 5.26365 15.3334 6.00002V12.6667C15.3334 13.4031 14.7364 14 14 14C13.2636 14 12.6667 13.4031 12.6667 12.6667V9.21869L6.94283 14.9428C6.42213 15.4635 5.57791 15.4635 5.05721 14.9428C4.53651 14.4221 4.53651 13.5779 5.05721 13.0572L10.78 7.33202L7.33335 7.33335C6.59698 7.33335 6.00002 6.73639 6.00002 6.00002C6.00002 5.26363 6.59698 4.66669 7.33335 4.66669H14Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
