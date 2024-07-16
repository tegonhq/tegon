import type { IconProps } from './types';

export function LabelLine({ size = 18, className, color }: IconProps) {
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
        d="M9.71336 3.53258C9.58958 3.50286 9.44938 3.49804 8.9245 3.49804H5.95C5.37757 3.49804 4.99336 3.49862 4.69748 3.5228C4.41035 3.54626 4.27307 3.58814 4.18251 3.63428C3.94731 3.75412 3.75608 3.94535 3.63624 4.18055C3.5901 4.27111 3.54822 4.40839 3.52476 4.69552C3.50058 4.9914 3.5 5.37561 3.5 5.94804V8.59546C3.5 9.24263 3.50482 9.44398 3.54835 9.62531C3.59122 9.80387 3.66193 9.97457 3.75788 10.1311C3.85531 10.2901 3.99428 10.4359 4.4519 10.8936L8.46025 14.9019C8.96402 15.4057 9.31037 15.7512 9.60045 15.9975C9.88384 16.238 10.0638 16.3395 10.2176 16.3895C10.569 16.5037 10.9477 16.5037 11.2991 16.3895C11.4529 16.3395 11.6329 16.238 11.9162 15.9975C12.2063 15.7512 12.5527 15.4057 13.0564 14.9019L14.9017 13.0566C15.4055 12.5529 15.751 12.2065 15.9973 11.9164C16.2379 11.633 16.3393 11.4531 16.3893 11.2993C16.5035 10.9478 16.5035 10.5692 16.3893 10.2178C16.3393 10.064 16.2379 9.88403 15.9973 9.60064C15.751 9.31055 15.4055 8.96421 14.9017 8.46044L10.6569 4.21563C10.2858 3.84448 10.1832 3.74875 10.0747 3.68224C9.96284 3.6137 9.84091 3.5632 9.71336 3.53258ZM8.99697 1.99801C9.41559 1.99777 9.74511 1.99758 10.0635 2.07402C10.3441 2.14139 10.6124 2.2525 10.8584 2.40328C11.1376 2.57438 11.3705 2.80753 11.6663 3.1037C11.6832 3.12059 11.7003 3.13768 11.7176 3.15497L15.9846 7.42199C16.4608 7.89814 16.8502 8.28754 17.1408 8.62987C17.4416 8.98421 17.6804 9.33715 17.8159 9.75423C18.028 10.407 18.028 11.1101 17.8159 11.7628C17.6804 12.1799 17.4416 12.5329 17.1408 12.8872C16.8502 13.2295 16.4608 13.6189 15.9846 14.0951L14.0949 15.9848C13.6187 16.4609 13.2293 16.8503 12.887 17.141C12.5327 17.4418 12.1797 17.6805 11.7627 17.8161C11.1099 18.0281 10.4068 18.0281 9.75404 17.8161C9.33697 17.6805 8.98403 17.4418 8.62969 17.141C8.28735 16.8503 7.89794 16.4609 7.42179 15.9848L3.39124 11.9542C3.37218 11.9351 3.35336 11.9163 3.33478 11.8978C2.9568 11.5201 2.68077 11.2443 2.47892 10.9149C2.30073 10.6241 2.16941 10.3071 2.0898 9.97547C1.99961 9.59982 1.99977 9.20962 1.99998 8.67528C1.99999 8.64903 2 8.62242 2 8.59546L2 5.91761C1.99999 5.38345 1.99998 4.9376 2.02974 4.57337C2.06078 4.19349 2.12789 3.83683 2.29973 3.49957C2.56338 2.98212 2.98408 2.56142 3.50153 2.29777C3.83879 2.12593 4.19544 2.05882 4.57533 2.02778C4.93956 1.99802 5.38541 1.99803 5.91956 1.99804L8.9245 1.99804C8.94896 1.99804 8.97311 1.99803 8.99697 1.99801Z"
        fill={color ? color : 'currentColor'}
      />
      <path
        d="M8.90288 7.40287C8.90288 8.2313 8.23131 8.90287 7.40288 8.90287C6.57445 8.90287 5.90288 8.2313 5.90288 7.40287C5.90288 6.57444 6.57445 5.90287 7.40288 5.90287C8.23131 5.90287 8.90288 6.57444 8.90288 7.40287Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
