/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function LabelFill({ size = 18, className, color }: IconProps) {
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
        d="M13.166 16.9284C13.6346 16.9252 14.0747 16.7033 14.3559 16.3284L18.4272 10.9C18.8272 10.3667 18.8272 9.63332 18.4272 9.09999L14.3546 3.66978C14.0741 3.2959 13.6355 3.07408 13.1681 3.06984L2.52614 2.97343C2.04815 2.97337 1.57942 3.49617 1.57942 3.97423L1.60518 9.99996L1.55261 16.0007C1.55266 16.4787 2.02199 17 2.5 17L13.166 16.9284ZM10.448 9.99996C10.448 9.04404 11.2229 8.26913 12.1789 8.26913C13.1347 8.26914 13.9097 9.04407 13.9097 9.99996C13.9097 10.9559 13.1348 11.7308 12.1789 11.7308C11.2229 11.7308 10.448 10.9559 10.448 9.99996Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
