/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function RelatedIssueLine({ size = 18, className, color }: IconProps) {
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
        x="2"
        y="2"
        width="16"
        height="16"
        rx="3"
        stroke={color ? color : 'currentColor'}
        strokeWidth="2"
      />
      <path
        d="M9.5 9C9.77614 9 10 8.77614 10 8.5V7.20711C10 6.76165 10.5386 6.53857 10.8536 6.85355L13.6464 9.64645C13.8417 9.84171 13.8417 10.1583 13.6464 10.3536L10.8536 13.1464C10.5386 13.4614 10 13.2383 10 12.7929V11.5C10 11.2239 9.77614 11 9.5 11H6.5C6.22386 11 6 10.7761 6 10.5V9.5C6 9.22386 6.22386 9 6.5 9H9.5Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
