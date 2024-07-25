import type { IconProps } from './types';

export function IssuesFill({ size = 18, className, color }: IconProps) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 1C2.79086 1 1 2.79086 1 5V15C1 17.2091 2.79086 19 5 19H15C17.2091 19 19 17.2091 19 15V5C19 2.79086 17.2091 1 15 1H5ZM8.10749 10.1227C8.30433 10.3076 8.61242 10.3028 8.80338 10.1118L10.6879 8.22725L12.2081 6.70712C12.5986 6.31659 13.2318 6.31659 13.6223 6.70712L13.6929 6.77774C14.0834 7.16826 14.0834 7.80142 13.6929 8.19195L9.52137 12.3635C8.93558 12.9493 7.98583 12.9493 7.40005 12.3635L5.70528 10.6687C5.31547 10.2789 5.31465 9.64715 5.70345 9.25634L5.73391 9.22571C6.11555 8.84209 6.73312 8.83164 7.12752 9.20213L8.10749 10.1227Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
