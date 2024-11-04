import type { IconProps } from './types';

export function RightSidebarOpen({ size = 18, className, color }: IconProps) {
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
        d="M15.116 17.25C15.906 17.25 16.203 17.194 16.496 17.038C16.729 16.913 16.913 16.729 17.038 16.495C17.194 16.203 17.25 15.906 17.25 15.115V4.885C17.25 4.094 17.194 3.797 17.038 3.505C16.9156 3.27364 16.7264 3.08444 16.495 2.962C16.203 2.806 15.906 2.75 15.115 2.75L4.885 2.75C4.094 2.75 3.797 2.806 3.505 2.962C3.27364 3.08444 3.08444 3.27364 2.962 3.505C2.806 3.797 2.75 4.094 2.75 4.885L2.75 15.114C2.75 15.905 2.806 16.202 2.962 16.494C3.087 16.728 3.271 16.912 3.505 17.037C3.797 17.193 4.094 17.249 4.885 17.249L15.116 17.25Z"
        stroke={color ? color : 'currentColor'}
        strokeWidth="1.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 17H12.5L12.5 3H11L11 17Z"
        fill={color ? color : 'currentColor'}
      />
      <path
        opacity="0.15"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 17H12L12 3H17V17Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
