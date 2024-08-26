import type { IconProps } from './types';

export function CheckCircle({ size = 16, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_6789_50229)">
        <path
          d="M8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5ZM11.5275 6.73051L7.72848 10.5298C7.58781 10.6705 7.39701 10.7495 7.19807 10.7495C6.99913 10.7495 6.80834 10.6704 6.6677 10.5297L4.66879 8.53007C4.37595 8.23712 4.37604 7.76224 4.66899 7.46941C4.96194 7.17657 5.43681 7.17666 5.72965 7.46961L7.19821 8.93873L10.4669 5.66988C10.7597 5.37698 11.2346 5.37696 11.5275 5.66985C11.8204 5.96273 11.8204 6.43761 11.5275 6.73051Z"
          fill={color ? color : 'currentColor'}
        />
      </g>
      <defs>
        <clipPath id="clip0_6789_50229">
          <rect width={size} height={size} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
