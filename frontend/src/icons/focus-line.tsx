/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function FocusLine({ size = 18, className, color }: IconProps) {
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
        d="M2 5.55555V3.77778C2 3.30628 2.1873 2.8541 2.5207 2.5207C2.8541 2.1873 3.30629 2 3.77778 2H5.55557"
        stroke={color ? color : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4445 2H16.2222C16.6937 2 17.1459 2.1873 17.4793 2.5207C17.8127 2.8541 18 3.30628 18 3.77778V5.55555"
        stroke={color ? color : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 14.4445V16.2223C18 16.6938 17.8127 17.146 17.4793 17.4794C17.1459 17.8128 16.6937 18.0001 16.2222 18.0001H14.4445"
        stroke={color ? color : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.55557 18.0001H3.77778C3.30629 18.0001 2.8541 17.8128 2.5207 17.4794C2.1873 17.146 2 16.6938 2 16.2223V14.4445"
        stroke={color ? color : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="7.53857"
        y="7.53845"
        width="5.32925"
        height="5.32923"
        rx="1.5"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
