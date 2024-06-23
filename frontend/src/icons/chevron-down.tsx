/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function ChevronDown({ size = 16, className, color }: IconProps) {
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
        d="M12.1297 6.62394C12.3999 6.93784 12.3645 7.41139 12.0506 7.68165L8.48447 10.7521C8.20296 10.9945 7.78645 10.9943 7.50519 10.7516L3.94636 7.68115C3.63274 7.41057 3.59785 6.93698 3.86843 6.62336C4.13901 6.30974 4.6126 6.27485 4.92622 6.54543L7.99562 9.19361L11.0719 6.54493C11.3858 6.27467 11.8594 6.31004 12.1297 6.62394Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
