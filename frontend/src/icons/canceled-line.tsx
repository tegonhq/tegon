/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function CanceledLine({ size = 18, className, color }: IconProps) {
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
        d="M13.0261 2.96967C13.319 3.26256 13.319 3.73744 13.0261 4.03033L9.05864 7.99775L13.0261 11.9652C13.3189 12.2581 13.3189 12.7329 13.0261 13.0258C12.7332 13.3187 12.2583 13.3187 11.9654 13.0258L7.99798 9.05841L4.03059 13.0258C3.73769 13.3187 3.26282 13.3187 2.96993 13.0258C2.67703 12.7329 2.67703 12.258 2.96993 11.9652L6.93732 7.99775L2.96991 4.03034C2.67702 3.73745 2.67702 3.26258 2.96991 2.96968C3.26281 2.67679 3.73768 2.67679 4.03057 2.96968L7.99798 6.93709L11.9654 2.96967C12.2583 2.67678 12.7332 2.67678 13.0261 2.96967Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
