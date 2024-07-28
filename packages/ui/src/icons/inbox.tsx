import type { IconProps } from './types';

export function Inbox({ size = 18, className, color }: IconProps) {
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
        d="M5.2939 3.19929C5.32506 3.19933 5.35655 3.19937 5.38839 3.19937H10.6116C10.6435 3.19937 10.675 3.19933 10.7061 3.19929C11.1825 3.19871 11.5796 3.19822 11.9312 3.33797C12.2391 3.46035 12.511 3.65879 12.7214 3.91474C12.9616 4.20703 13.0822 4.58536 13.2268 5.03931C13.2363 5.06899 13.2459 5.09899 13.2556 5.12931L14.2146 8.12623C14.2689 8.29592 14.3077 8.41711 14.3354 8.54288C14.3599 8.65422 14.3775 8.76697 14.3881 8.88048C14.4001 9.00871 14.4 9.13597 14.4 9.31414L14.4 10.3688C14.4 10.9521 14.4 11.4262 14.3686 11.8109C14.3361 12.2082 14.2672 12.5627 14.0992 12.8924C13.8346 13.4117 13.4124 13.8339 12.893 14.0985C12.5633 14.2665 12.2088 14.3355 11.8116 14.3679C11.4268 14.3994 10.9527 14.3994 10.3694 14.3994H5.63062C5.04731 14.3994 4.57319 14.3994 4.18847 14.3679C3.79118 14.3355 3.4367 14.2665 3.107 14.0985C2.58767 13.8339 2.16544 13.4117 1.90083 12.8924C1.73284 12.5627 1.66389 12.2082 1.63143 11.8109C1.6 11.4262 1.6 10.9521 1.60001 10.3687L1.60001 9.33886C1.60001 9.33051 1.60001 9.32227 1.60001 9.31415C1.59998 9.13597 1.59997 9.00871 1.61191 8.88048C1.62249 8.76697 1.64009 8.65422 1.66462 8.54288C1.69232 8.41711 1.73112 8.29592 1.78544 8.12622C1.78792 8.11848 1.79043 8.11064 1.79298 8.10269L2.74446 5.12932C2.75416 5.09899 2.76372 5.06899 2.77318 5.0393C2.91783 4.58536 3.03838 4.20702 3.27865 3.91474C3.48905 3.65879 3.76089 3.46036 4.06879 3.33797C4.4204 3.19822 4.81747 3.19871 5.2939 3.19929ZM5.38839 4.39937C4.76582 4.39937 4.62135 4.40966 4.51203 4.45312C4.39264 4.50057 4.28723 4.57751 4.20565 4.67676C4.13094 4.76764 4.07711 4.9021 3.88737 5.49505L3.02198 8.19937H5.80001C6.13138 8.19937 6.40001 8.468 6.40001 8.79937C6.40001 9.00949 6.4414 9.21754 6.5218 9.41166C6.60221 9.60579 6.72007 9.78217 6.86864 9.93074C7.01721 10.0793 7.1936 10.1972 7.38772 10.2776C7.58184 10.358 7.7899 10.3994 8.00001 10.3994C8.21013 10.3994 8.41818 10.358 8.6123 10.2776C8.80643 10.1972 8.98281 10.0793 9.13138 9.93074C9.27996 9.78217 9.39781 9.60579 9.47822 9.41166C9.55863 9.21754 9.60001 9.00949 9.60001 8.79937C9.60001 8.468 9.86864 8.19937 10.2 8.19937H12.978L12.1127 5.49504C11.9229 4.9021 11.8691 4.76764 11.7944 4.67676C11.7128 4.57751 11.6074 4.50057 11.488 4.45312C11.3787 4.40966 11.2342 4.39937 10.6116 4.39937H5.38839ZM13.2 9.39937H10.735C10.6997 9.56022 10.6502 9.71802 10.5869 9.87088C10.4462 10.2106 10.2399 10.5193 9.97991 10.7793C9.7199 11.0393 9.41124 11.2455 9.07152 11.3862C8.73181 11.5269 8.36771 11.5994 8.00001 11.5994C7.63231 11.5994 7.26821 11.5269 6.9285 11.3862C6.58879 11.2455 6.28012 11.0393 6.02011 10.7793C5.76011 10.5193 5.55386 10.2106 5.41315 9.87088C5.34983 9.71802 5.30034 9.56022 5.26505 9.39937H2.80001V10.3434C2.80001 10.9581 2.80048 11.3831 2.82745 11.7132C2.85384 12.0363 2.90261 12.2153 2.97004 12.3476C3.1196 12.6411 3.35825 12.8798 3.65179 13.0293C3.78413 13.0968 3.96311 13.1455 4.28619 13.1719C4.61627 13.1989 5.04125 13.1994 5.65601 13.1994H10.344C10.9588 13.1994 11.3838 13.1989 11.7138 13.1719C12.0369 13.1455 12.2159 13.0968 12.3482 13.0293C12.6418 12.8798 12.8804 12.6411 13.03 12.3476C13.0974 12.2153 13.1462 12.0363 13.1726 11.7132C13.1995 11.3831 13.2 10.9581 13.2 10.3434V9.39937Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}