/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function BacklogLine({ size = 18, className, color }: IconProps) {
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
        d="M9.72875 2.25H10.2712C11.9873 2.25 13.2694 2.55779 14.3522 3.13682C15.422 3.70311 16.2969 4.57798 16.8632 5.64782C17.4422 6.73061 17.75 8.01268 17.75 9.72875V10.2712C17.75 11.9873 17.4422 13.2694 16.8632 14.3522C16.2969 15.422 15.422 16.2969 14.3522 16.8632C13.2694 17.4422 11.9873 17.75 10.2712 17.75H9.72875C8.01268 17.75 6.73061 17.4422 5.64782 16.8632C4.57798 16.2969 3.70311 15.422 3.13682 14.3522C2.55779 13.2694 2.25 11.9873 2.25 10.2712V9.72875C2.25 8.01268 2.55779 6.73061 3.13682 5.64782C3.70341 4.57782 4.57868 3.70293 5.64893 3.13682C6.73061 2.55779 8.01268 2.25 9.72875 2.25Z"
        stroke={color ? color : 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="square"
        stroke-dasharray="3 12"
      />
      <circle cx="10" cy="10" r="2" fill={color ? color : 'currentColor'} />
    </svg>
  );
}
