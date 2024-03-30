/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function SubIssueLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="18"
        y="2"
        width="16"
        height="16"
        rx="3"
        transform="rotate(90 18 2)"
        stroke={color ? color : 'currentColor'}
        strokeWidth="2"
      />
      <path
        d="M11 9.5C11 9.77614 11.2239 10 11.5 10H12.7929C13.2383 10 13.4614 10.5386 13.1464 10.8536L10.3536 13.6464C10.1583 13.8417 9.84171 13.8417 9.64645 13.6464L6.85355 10.8536C6.53857 10.5386 6.76165 10 7.20711 10L8.5 10C8.77614 10 9 9.77614 9 9.5V6.5C9 6.22386 9.22386 6 9.5 6H10.5C10.7761 6 11 6.22386 11 6.5V9.5Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
