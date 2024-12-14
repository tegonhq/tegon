import type { IconProps } from './types';

export function ArrowUp({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 14C8.41421 14 8.75 13.6642 8.75 13.25V4.55578L11.3659 7.17164C11.6587 7.46453 12.1336 7.46453 12.4265 7.17164C12.7194 6.87874 12.7194 6.40387 12.4265 6.11098L8.53033 2.21479C8.23744 1.92189 7.76256 1.92189 7.46967 2.21479L3.57348 6.11098C3.28058 6.40387 3.28058 6.87874 3.57348 7.17164C3.86637 7.46453 4.34124 7.46453 4.63414 7.17164L7.25 4.55578V13.25C7.25 13.6642 7.58578 14 8 14Z"
        fill="black"
        style="fill:black;fill-opacity:1;"
      />
    </svg>
  );
}
