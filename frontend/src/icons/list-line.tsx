/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function ListLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 5.25C2 4.83579 2.33579 4.5 2.75 4.5H17.25C17.6642 4.5 18 4.83579 18 5.25C18 5.66421 17.6642 6 17.25 6H2.75C2.33579 6 2 5.66421 2 5.25ZM2 10.25C2 9.83579 2.33579 9.5 2.75 9.5H17.25C17.6643 9.5 18 9.83579 18 10.25C18 10.6642 17.6643 11 17.25 11H2.75C2.33579 11 2 10.6642 2 10.25ZM2 15.2524C2 14.8382 2.33579 14.5024 2.75 14.5024H17.25C17.6643 14.5024 18 14.8382 18 15.2524C18 15.6667 17.6643 16.0024 17.25 16.0024H2.75C2.33579 16.0024 2 15.6667 2 15.2524Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
