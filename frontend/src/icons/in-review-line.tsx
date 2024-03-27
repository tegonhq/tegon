/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function InReviewLine({ size = 18, className, color }: IconProps) {
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
        d="M1 10C1 14.9705 5.02944 19 10 19C14.9705 19 19 14.9705 19 10C19 5.02944 14.9705 1 10 1C5.02944 1 1 5.02944 1 10ZM17.2 10C17.2 13.9765 13.9765 17.2 10 17.2C6.02355 17.2 2.8 13.9765 2.8 10C2.8 6.02355 6.02355 2.8 10 2.8C13.9765 2.8 17.2 6.02355 17.2 10ZM15.3998 10C15.3998 12.9823 12.9821 15.4 9.99982 15.4C7.18589 15.4 4.87468 13.2477 4.62259 10.4996C4.59737 10.2246 4.82365 10 5.09979 10H9.49982C9.77596 10 9.99982 9.77614 9.99982 9.5V5.1C9.99982 4.82386 10.2244 4.59758 10.4994 4.6228C13.2475 4.87489 15.3998 7.1861 15.3998 10Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
