import type { IconProps } from './types';

export function ItalicLine({ size = 18, className, color }: IconProps) {
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
        d="M6 2.74805C6 2.33383 6.33579 1.99805 6.75 1.99805H15.25C15.6642 1.99805 16 2.33383 16 2.74805C16 3.16226 15.6642 3.49805 15.25 3.49805H11.6537L9.86049 16.5024H13.25C13.6642 16.5024 14 16.8382 14 17.2524C14 17.6667 13.6642 18.0024 13.25 18.0024H4.75C4.33579 18.0024 4 17.6667 4 17.2524C4 16.8382 4.33579 16.5024 4.75 16.5024H8.3463L10.1395 3.49805H6.75C6.33579 3.49805 6 3.16226 6 2.74805Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
