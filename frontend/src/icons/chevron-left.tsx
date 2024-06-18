/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function ChevronLeft({ size = 16, className, color }: IconProps) {
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
        d="M11.8333 4.68165C11.5194 4.41139 11.0458 4.44676 10.7756 4.76066L6.68164 9.51556C6.43926 9.79707 6.43948 10.2136 6.68214 10.4948L10.7761 15.2399C11.0466 15.5536 11.5202 15.5885 11.8339 15.3179C12.1475 15.0473 12.1824 14.5737 11.9118 14.2601L8.24012 10.0044L11.9123 5.73937C12.1825 5.42547 12.1472 4.95192 11.8333 4.68165Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
