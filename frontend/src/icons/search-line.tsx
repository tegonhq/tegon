import type { IconProps } from './types';

export function SearchLine({ size = 18, className, color }: IconProps) {
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
        d="M3.75 9C3.75 6.10051 6.10051 3.75 9 3.75C11.8995 3.75 14.25 6.10051 14.25 9C14.25 11.8995 11.8995 14.25 9 14.25C6.10051 14.25 3.75 11.8995 3.75 9ZM9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 12.7279 5.27208 15.75 9 15.75C10.6355 15.75 12.1351 15.1683 13.3033 14.2006L16.4873 17.3841C16.7802 17.677 17.2551 17.677 17.548 17.3841C17.8408 17.0912 17.8408 16.6163 17.5479 16.3234L14.3458 13.1218C15.2262 11.9816 15.75 10.552 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
