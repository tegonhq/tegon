/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function ProjectsLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="2"
          width="6.10289"
          height="6.10289"
          rx="2"
          stroke={color ? color : 'currentColor'}
          stroke-width="2"
        />
        <rect
          x="11.8972"
          y="2"
          width="6.10289"
          height="6.10289"
          rx="2"
          stroke={color ? color : 'currentColor'}
          stroke-width="2"
        />
        <rect
          x="2"
          y="11.8971"
          width="6.10289"
          height="6.10289"
          rx="2"
          stroke={color ? color : 'currentColor'}
          stroke-width="2"
        />
        <rect
          x="11.8972"
          y="11.8971"
          width="6.10289"
          height="6.10289"
          rx="2"
          stroke={color ? color : 'currentColor'}
          stroke-width="2"
        />
      </svg>
    </svg>
  );
}
