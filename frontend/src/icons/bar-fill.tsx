import type { IconProps } from './types';

export function BarFill({ size = 18, className, color }: IconProps) {
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
        d="M3 13L3 17"
        stroke={color ? color : 'currentColor'}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M10 3L10 17"
        stroke={color ? color : 'currentColor'}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M17 9V17"
        stroke={color ? color : 'currentColor'}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
