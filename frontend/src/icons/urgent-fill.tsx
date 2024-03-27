/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function UrgentFill({ size = 18, className, color }: IconProps) {
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10ZM10 4.5C10.5523 4.5 11 4.94772 11 5.5V10.5C11 11.0523 10.5523 11.5 10 11.5C9.44771 11.5 9 11.0523 9 10.5V5.5C9 4.94772 9.44771 4.5 10 4.5ZM10 15.5C10.5523 15.5 11 15.0523 11 14.5C11 13.9477 10.5523 13.5 10 13.5C9.44771 13.5 9 13.9477 9 14.5C9 15.0523 9.44771 15.5 10 15.5Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
