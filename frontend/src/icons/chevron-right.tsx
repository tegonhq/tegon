import type { IconProps } from './types';

export function ChevronRight({ size = 16, className, color }: IconProps) {
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
        d="M6.62467 12.1309C6.93857 12.4011 7.41212 12.3658 7.68239 12.0519L10.7528 8.48569C10.9952 8.20418 10.995 7.78767 10.7523 7.50641L7.68189 3.94758C7.41131 3.63396 6.93772 3.59907 6.62409 3.86965C6.31047 4.14023 6.27558 4.61382 6.54617 4.92745L9.19435 7.99684L6.54567 11.0732C6.2754 11.3871 6.31078 11.8606 6.62467 12.1309Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
