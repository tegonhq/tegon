/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function SubIssueFill({ size = 18, className, color }: IconProps) {
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
        d="M19 5C19 2.79086 17.2091 1 15 1L5 1C2.79086 1 1 2.79086 1 5L1 15C1 17.2091 2.79086 19 5 19L15 19C17.2091 19 19 17.2091 19 15L19 5ZM11.5 10C11.2239 10 11 9.77614 11 9.5V6.5C11 6.22386 10.7761 6 10.5 6H9.5C9.22386 6 9 6.22386 9 6.5V9.5C9 9.77614 8.77614 10 8.5 10H7.20711C6.76165 10 6.53857 10.5386 6.85355 10.8536L9.64645 13.6464C9.84171 13.8417 10.1583 13.8417 10.3536 13.6464L13.1464 10.8536C13.4614 10.5386 13.2383 10 12.7929 10H11.5Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
