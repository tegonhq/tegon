import type { IconProps } from './types';

export function Loader({ size = 18, className, color }: IconProps) {
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
        d="M14 8C14 9.32081 13.5642 10.6047 12.7601 11.6526C11.9561 12.7004 10.8287 13.4537 9.55291 13.7956C8.27711 14.1374 6.92416 14.0487 5.7039 13.5433C4.48363 13.0378 3.46425 12.1439 2.80385 11C2.14345 9.85615 1.87893 8.52635 2.05133 7.21684C2.22373 5.90734 2.82341 4.69131 3.75736 3.75736C4.69131 2.82341 5.90734 2.22373 7.21684 2.05133C8.52635 1.87893 9.85615 2.14344 11 2.80385"
        stroke={color ? color : 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
