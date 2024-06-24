/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function EditLine({ size = 18, className, color }: IconProps) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5358 1.66419C12.0373 1.44527 11.4698 1.44527 10.9713 1.66419C10.7686 1.75324 10.6042 1.87791 10.4581 2.00627C10.3207 2.12698 10.1662 2.28155 9.99267 2.45507L2.60308 9.84464C2.3076 10.1398 2.075 10.3721 1.90431 10.6506C1.75389 10.8961 1.64304 11.1637 1.57583 11.4437C1.49957 11.7613 1.49978 12.5562 1.50003 12.9738C1.5 13.0957 1.49997 13.2278 1.50931 13.3422C1.51989 13.4716 1.54606 13.6427 1.63595 13.8191C1.75551 14.0537 1.94628 14.2445 2.18093 14.364C2.35734 14.4539 2.52836 14.4801 2.65781 14.4907C2.77218 14.5 2.90431 14.5 3.02618 14.5C3.44381 14.5002 4.23866 14.5004 4.55633 14.4242C4.83626 14.3569 5.10387 14.2461 5.34934 14.0957C5.62789 13.925 5.86021 13.6924 6.15534 13.3969L13.5449 6.00734C13.7184 5.83382 13.873 5.67925 13.9937 5.54185C14.1221 5.39577 14.2467 5.23142 14.3358 5.02864C14.5547 4.53014 14.5547 3.96272 14.3358 3.46421C14.2467 3.26144 14.1221 3.09709 13.9937 2.951C13.873 2.81363 13.7184 2.65908 13.5449 2.48559L13.5145 2.45512C13.341 2.28158 13.1864 2.12699 13.049 2.00627C12.9029 1.87791 12.7385 1.75324 12.5358 1.66419ZM11.573 3.03434C11.6881 2.98382 11.819 2.98382 11.9341 3.03434C11.9376 3.03587 11.9697 3.04997 12.0612 3.13043C12.1579 3.21536 12.2781 3.33507 12.4715 3.52846C12.6649 3.72185 12.7846 3.84208 12.8695 3.93874C12.95 4.03031 12.9641 4.06242 12.9656 4.06592C13.0162 4.18096 13.0161 4.31195 12.9656 4.42698C12.9641 4.43048 12.95 4.46255 12.8695 4.55412C12.7846 4.65078 12.6649 4.77101 12.4715 4.9644L11.7483 5.68764L10.3123 4.25171L11.0356 3.52846C11.229 3.33507 11.3492 3.21536 11.4459 3.13043C11.5374 3.04997 11.5695 3.03587 11.573 3.03434ZM9.25167 5.31237L3.71237 10.8517C3.3421 11.222 3.2466 11.3243 3.18024 11.4325C3.11187 11.5441 3.06148 11.6658 3.03093 11.793C3.0199 11.839 3.01279 12.018 3.00803 12.2249C2.9984 12.6435 2.99359 12.8528 3.01561 12.8971C3.0442 12.9546 3.04794 12.9583 3.10536 12.987C3.1496 13.009 3.35813 13.0045 3.77519 12.9954C3.98467 12.9909 4.14811 12.9832 4.20699 12.9691C4.33423 12.9385 4.45587 12.8881 4.56745 12.8197C4.67573 12.7534 4.77803 12.6579 5.1483 12.2876L10.6876 6.7483L9.25167 5.31237Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
