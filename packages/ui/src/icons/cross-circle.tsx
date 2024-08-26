import type { IconProps } from './types';

export function CrossCircle({ size = 16, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_6789_50245)">
        <path
          d="M8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5ZM5.17587 5.17116C5.41019 4.93684 5.79009 4.93684 6.0244 5.17116L8.00241 7.14909L9.98264 5.16884C10.217 4.93452 10.5969 4.93452 10.8312 5.16884C11.0655 5.40315 11.0655 5.78305 10.8312 6.01737L8.85094 7.99762L10.8306 9.97725C11.0649 10.2116 11.0649 10.5915 10.8306 10.8258C10.5963 11.0601 10.2164 11.0601 9.98205 10.8258L8.00241 8.84615L6.01737 10.8311C5.78305 11.0655 5.40315 11.0655 5.16884 10.8311C4.93452 10.5968 4.93452 10.2169 5.16884 9.98261L7.15388 7.99762L5.17587 6.01969C4.94156 5.78537 4.94156 5.40547 5.17587 5.17116Z"
          fill={color ? color : 'currentColor'}
        />
      </g>
      <defs>
        <clipPath id="clip0_6789_50245">
          <rect width={size} height={size} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}