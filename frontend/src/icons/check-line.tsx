/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function CheckLine({ size = 18, className }: IconProps) {
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
        d="M7.33011 11.7916C7.14169 11.9724 6.84584 11.9777 6.65099 11.8039L4.14788 9.5701C3.7589 9.22297 3.16849 9.23294 2.79144 9.59299L1.75933 10.5786C1.34608 10.9732 1.34693 11.6333 1.7612 12.0268L5.95852 16.0142C6.53934 16.5659 7.45122 16.5639 8.02957 16.0096L18.2605 6.20353C18.666 5.81486 18.6719 5.16854 18.2737 4.77249L17.1838 3.68879C16.7987 3.3058 16.1782 3.3003 15.7863 3.67639L7.33011 11.7916Z"
        fill="currentColor"
      />
    </svg>
  );
}
