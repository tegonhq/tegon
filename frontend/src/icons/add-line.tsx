import type { IconProps } from './types';

export function AddLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.00006 2.25C8.41427 2.25 8.75006 2.58579 8.75006 3V7.25H13C13.4142 7.25 13.75 7.58579 13.75 8C13.75 8.41421 13.4142 8.75 13 8.75H8.75006V13C8.75006 13.4142 8.41427 13.75 8.00006 13.75C7.58585 13.75 7.25006 13.4142 7.25006 13V8.75H3C2.58579 8.75 2.25 8.41421 2.25 8C2.25 7.58579 2.58579 7.25 3 7.25H7.25006V3C7.25006 2.58579 7.58585 2.25 8.00006 2.25Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
