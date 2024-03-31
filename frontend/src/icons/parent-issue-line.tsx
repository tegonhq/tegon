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
      <rect
        x="2"
        y="2"
        width="16"
        height="16"
        rx="3"
        stroke={color ? color : 'currentColor'}
        strokeWidth="2"
      />
      <path
        d="M8.75 9.25C9.02614 9.25 9.25 9.02614 9.25 8.75V7.5C9.25 7.22386 9.47386 7 9.75 7H10.25C10.5261 7 10.75 7.22386 10.75 7.5V8.75C10.75 9.02614 10.9739 9.25 11.25 9.25H12.5C12.7761 9.25 13 9.47386 13 9.75V10.25C13 10.5261 12.7761 10.75 12.5 10.75H11.25C10.9739 10.75 10.75 10.9739 10.75 11.25V12.5C10.75 12.7761 10.5261 13 10.25 13H9.75C9.47386 13 9.25 12.7761 9.25 12.5V11.25C9.25 10.9739 9.02614 10.75 8.75 10.75H7.5C7.22386 10.75 7 10.5261 7 10.25V9.75C7 9.47386 7.22386 9.25 7.5 9.25H8.75Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
