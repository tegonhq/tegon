/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function Inbox({ size = 18, className, color }: IconProps) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.05411 1H15.9459C16.6718 1 17.2936 1.51983 17.4222 2.23427L18.9763 10.8682C18.9921 10.9559 19 11.0448 19 11.1339V17.5C19 18.3284 18.3284 19 17.5 19H2.5C1.67157 19 1 18.3284 1 17.5V11.1339C1 11.0448 1.00794 10.9559 1.02373 10.8682L2.57783 2.23427C2.70643 1.51983 3.32818 1 4.05411 1ZM14.2859 10H17.2L15.7554 3H4.24452L2.8 10H5.71411C6.54254 10 7.181 10.7083 7.55837 11.4458C8.03248 12.3723 8.94814 13 9.99999 13C11.0518 13 11.9675 12.3723 12.4416 11.4458C12.819 10.7083 13.4574 10 14.2859 10Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
