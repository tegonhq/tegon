import type { IconProps } from './types';

export function Cycle({ size = 16, className, color }: IconProps) {
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
        d="M10.9126 7.64568H10C5.46331 7.64568 1.78632 9.48463 1.78632 11.7525C1.78632 14.0204 5.46331 15.8594 10 15.8594C14.5367 15.8594 18.2137 14.0204 18.2137 11.7525C18.2137 10.3288 16.7635 9.07486 14.5632 8.33837C16.7635 9.07486 18.2137 10.3288 18.2137 11.7525C18.2137 14.0204 14.5367 15.8594 10 15.8594C5.46331 15.8594 1.78632 14.0204 1.78632 11.7525C1.78632 9.48463 5.46331 7.64568 10 7.64568"
        stroke={color ? color : 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.6311 5.36262L10.9127 7.6442L8.6311 9.92578"
        stroke={color ? color : 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
