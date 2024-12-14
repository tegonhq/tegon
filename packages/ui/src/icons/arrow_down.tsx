import type { IconProps } from './types';

export function ArrowDown({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 1.99512C7.58578 1.99512 7.25 2.3309 7.25 2.74512V11.4393L4.63414 8.82347C4.34124 8.53058 3.86637 8.53058 3.57348 8.82347C3.28058 9.11636 3.28058 9.59124 3.57348 9.88413L7.46967 13.7803C7.76256 14.0732 8.23744 14.0732 8.53033 13.7803L12.4265 9.88413C12.7194 9.59124 12.7194 9.11636 12.4265 8.82347C12.1336 8.53058 11.6587 8.53058 11.3659 8.82347L8.75 11.4393V2.74512C8.75 2.3309 8.41421 1.99512 8 1.99512Z"
        fill="black"
        style="fill:black;fill-opacity:1;"
      />
    </svg>
  );
}
