/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function BoardLine({ size = 18, className, color }: IconProps) {
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
        d="M2.25 5.64609C2.25 4.80601 2.25 4.38598 2.41349 4.06511C2.5573 3.78286 2.78677 3.55339 3.06901 3.40958C3.38988 3.24609 3.80992 3.24609 4.65 3.24609H15.35C16.1901 3.24609 16.6101 3.24609 16.931 3.40958C17.2132 3.55339 17.4427 3.78286 17.5865 4.0651C17.75 4.38597 17.75 4.80601 17.75 5.64608L17.75 14.3504C17.75 15.1904 17.75 15.6105 17.5865 15.9313C17.4427 16.2136 17.2133 16.4431 16.931 16.5869C16.6102 16.7504 16.1901 16.7504 15.35 16.7504H4.65C3.80992 16.7504 3.38988 16.7504 3.06901 16.5869C2.78677 16.4431 2.5573 16.2136 2.41349 15.9313C2.25 15.6105 2.25 15.1904 2.25 14.3504V5.64609Z"
        stroke={color ? color : 'currentColor'}
        strokeWidth="1.5"
      />
      <path
        d="M12.75 3.25L12.7501 16.7543"
        stroke={color ? color : 'currentColor'}
        strokeWidth="1.5"
      />
      <path
        d="M7.25 3.25V16.7543"
        stroke={color ? color : 'currentColor'}
        strokeWidth="1.5"
      />
    </svg>
  );
}
