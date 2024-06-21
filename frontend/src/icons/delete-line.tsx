/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function DeleteLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_5338_17063)">
        <path
          d="M6.75518 0.751298C7.14949 0.58797 7.57211 0.503906 7.9989 0.503906C8.4257 0.503906 8.84831 0.58797 9.24262 0.751298C9.63693 0.914625 9.99521 1.15402 10.297 1.45581C10.5988 1.7576 10.8382 2.11588 11.0015 2.51019C11.0674 2.6693 11.1204 2.83302 11.1602 2.99977H14.5001C14.9143 2.99977 15.2501 3.33556 15.2501 3.74977C15.2501 4.16398 14.9143 4.49977 14.5001 4.49977H13.9359L13.2528 12.18C13.2092 12.6702 13.1727 13.081 13.1161 13.4163C13.0569 13.7672 12.9674 14.0939 12.787 14.3995C12.5086 14.8709 12.096 15.2485 11.6017 15.484C11.2813 15.6366 10.948 15.6969 10.5932 15.7247C10.2543 15.7514 9.84191 15.7514 9.34977 15.7514H6.64825C6.15608 15.7514 5.74366 15.7514 5.4047 15.7247C5.04993 15.6969 4.71659 15.6366 4.39616 15.484C3.90193 15.2485 3.48923 14.8708 3.21091 14.3994C3.03047 14.0937 2.94096 13.767 2.88178 13.4161C2.82525 13.0808 2.78874 12.67 2.74518 12.1798L2.0626 4.49977H1.50146C1.08725 4.49977 0.751465 4.16398 0.751465 3.74977C0.751465 3.33556 1.08725 2.99977 1.50146 2.99977H1.92928H4.83761C4.87739 2.83302 4.93039 2.6693 4.99629 2.51019C5.15962 2.11588 5.39901 1.7576 5.7008 1.45581C6.00259 1.15402 6.36087 0.914626 6.75518 0.751298ZM5.44624 4.50209L3.56858 4.50055L4.23674 12.0183C4.28353 12.5447 4.31533 12.8964 4.3609 13.1667C4.40493 13.4278 4.45321 13.5531 4.50262 13.6368C4.62913 13.8511 4.81672 14.0228 5.04137 14.1298C5.1291 14.1716 5.2582 14.2086 5.5222 14.2294C5.79541 14.2508 6.14859 14.2514 6.67712 14.2514H9.3209C9.8494 14.2514 10.2026 14.2508 10.4758 14.2294C10.7397 14.2086 10.8688 14.1716 10.9566 14.1298C11.1812 14.0228 11.3688 13.8511 11.4953 13.6369C11.5447 13.5532 11.593 13.4279 11.637 13.1668C11.6826 12.8966 11.7144 12.5448 11.7613 12.0184L12.4293 4.5078L5.55032 4.50217C5.53333 4.50332 5.51618 4.50391 5.4989 4.50391C5.4812 4.50391 5.46364 4.50329 5.44624 4.50209ZM9.57807 2.99977C9.49253 2.82064 9.37702 2.65715 9.23634 2.51647C9.07384 2.35397 8.88092 2.22506 8.6686 2.13712C8.45628 2.04917 8.22871 2.00391 7.9989 2.00391C7.76909 2.00391 7.54152 2.04917 7.32921 2.13712C7.11689 2.22506 6.92397 2.35397 6.76146 2.51647C6.62078 2.65715 6.50528 2.82064 6.41973 2.99977H9.57807ZM5.92431 5.90355C6.33647 5.86235 6.70399 6.16307 6.74519 6.57523L7.24519 11.5769C7.2864 11.9891 6.98567 12.3566 6.57352 12.3978C6.16136 12.439 5.79383 12.1383 5.75263 11.7261L5.25263 6.72444C5.21143 6.31228 5.51215 5.94476 5.92431 5.90355ZM10.0735 5.90355C10.4857 5.94476 10.7864 6.31228 10.7452 6.72444L10.2452 11.7261C10.204 12.1383 9.83647 12.439 9.42431 12.3978C9.01215 12.3566 8.71143 11.9891 8.75263 11.5769L9.25263 6.57523C9.29383 6.16307 9.66136 5.86235 10.0735 5.90355Z"
          fill={color ? color : 'currentColor'}
        />
      </g>
      <defs>
        <clipPath id="clip0_5338_17063">
          <rect width={size} height={size} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
