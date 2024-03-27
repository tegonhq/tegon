/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function DoneFill({ size = 18, className, color }: IconProps) {
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1ZM8.33818 10.6937C8.53228 10.8668 8.8267 10.8622 9.01531 10.6831L11.051 8.75L12.7318 7.1539C13.1177 6.78742 13.7231 6.78743 14.109 7.15391L14.2364 7.27487C14.6516 7.66915 14.6516 8.33088 14.2364 8.72515L9.7145 13.0192C9.13561 13.5689 8.22759 13.5689 7.6487 13.0192L5.76165 11.2272C5.34719 10.8336 5.34633 10.1733 5.75978 9.7787L5.84233 9.69989C6.21935 9.34002 6.80954 9.33006 7.19848 9.67701L8.33818 10.6937Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
