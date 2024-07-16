import type { IconProps } from "./types";

export function TeamLine({ size = 18, className, color }: IconProps) {
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
        d="M6.25 3.5C4.59315 3.5 3.25 4.84315 3.25 6.5C3.25 8.15685 4.59315 9.5 6.25 9.5C7.90685 9.5 9.25 8.15685 9.25 6.5C9.25 4.84315 7.90685 3.5 6.25 3.5ZM4.75 6.5C4.75 5.67157 5.42157 5 6.25 5C7.07843 5 7.75 5.67157 7.75 6.5C7.75 7.32843 7.07843 8 6.25 8C5.42157 8 4.75 7.32843 4.75 6.5Z"
        fill={color ? color : "currentColor"}
      />
      <path
        d="M2.68771 11.5691C3.64786 11.0152 4.91372 10.75 6.25 10.75C7.58628 10.75 8.85214 11.0152 9.81229 11.5691C10.7892 12.1327 11.5 13.037 11.5 14.25C11.5 14.9572 11.2245 15.5559 10.7185 15.9607C10.2351 16.3474 9.61439 16.5 9 16.5H3.5C2.88561 16.5 2.26489 16.3474 1.78148 15.9607C1.27554 15.5559 1 14.9572 1 14.25C1 13.037 1.71083 12.1327 2.68771 11.5691ZM3.43729 12.8684C2.78917 13.2423 2.5 13.713 2.5 14.25C2.5 14.5428 2.59946 14.6941 2.71852 14.7893C2.86011 14.9026 3.11439 15 3.5 15H9C9.38561 15 9.63989 14.9026 9.78148 14.7893C9.90054 14.6941 10 14.5428 10 14.25C10 13.713 9.71083 13.2423 9.06271 12.8684C8.39786 12.4848 7.41372 12.25 6.25 12.25C5.08628 12.25 4.10214 12.4848 3.43729 12.8684Z"
        fill={color ? color : "currentColor"}
      />
      <path
        d="M13.75 3.5C12.0931 3.5 10.75 4.84315 10.75 6.5C10.75 8.15685 12.0931 9.5 13.75 9.5C15.4069 9.5 16.75 8.15685 16.75 6.5C16.75 4.84315 15.4069 3.5 13.75 3.5ZM12.25 6.5C12.25 5.67157 12.9216 5 13.75 5C14.5784 5 15.25 5.67157 15.25 6.5C15.25 7.32843 14.5784 8 13.75 8C12.9216 8 12.25 7.32843 12.25 6.5Z"
        fill={color ? color : "currentColor"}
      />
      <path
        d="M13.75 12.25C13.523 12.25 13.2965 12.2611 13.0732 12.283C12.661 12.3235 12.294 12.0221 12.2536 11.6098C12.2131 11.1976 12.5145 10.8306 12.9268 10.7902C13.1988 10.7635 13.4742 10.75 13.75 10.75C15.0863 10.75 16.3521 11.0152 17.3123 11.5691C18.2892 12.1327 19 13.037 19 14.25C19 14.9572 18.7245 15.5559 18.2185 15.9607C17.7351 16.3474 17.1144 16.5 16.5 16.5H13.5C13.0858 16.5 12.75 16.1642 12.75 15.75C12.75 15.3358 13.0858 15 13.5 15H16.5C16.8856 15 17.1399 14.9026 17.2815 14.7893C17.4005 14.6941 17.5 14.5428 17.5 14.25C17.5 13.713 17.2108 13.2423 16.5627 12.8684C15.8979 12.4848 14.9137 12.25 13.75 12.25Z"
        fill={color ? color : "currentColor"}
      />
    </svg>
  );
}
