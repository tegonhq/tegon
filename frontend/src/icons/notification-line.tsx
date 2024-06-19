/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function NotificationLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size + 1}
      viewBox="0 0 20 21"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.5001 7.99805C4.5001 4.96048 6.96253 2.49805 10.0001 2.49805C13.0377 2.49805 15.5001 4.96048 15.5001 7.99805V10.1768C15.5001 10.411 15.5659 10.6404 15.6899 10.839L16.9306 12.8252C17.6587 13.9908 16.8207 15.5023 15.4464 15.5023H13.7417C13.6795 16.4373 13.2741 17.2795 12.6517 17.9018C11.974 18.5796 11.0354 19.0001 10.0001 19.0001C8.96477 19.0001 8.02624 18.5796 7.34845 17.9018C6.72613 17.2795 6.32067 16.4373 6.25846 15.5023H4.55382C3.17951 15.5023 2.3415 13.9908 3.0696 12.8252L4.31026 10.839C4.43432 10.6404 4.5001 10.411 4.5001 10.1768V7.99805ZM7.76403 15.5023C7.82194 16.0228 8.0571 16.4891 8.40911 16.8411C8.8171 17.2491 9.37857 17.5001 10.0001 17.5001C10.6216 17.5001 11.1831 17.2491 11.5911 16.8411C11.9431 16.4891 12.1783 16.0228 12.2362 15.5023H7.76403ZM10.0001 3.99805C7.79096 3.99805 6.0001 5.78891 6.0001 7.99805V10.1768C6.0001 10.692 5.85539 11.1968 5.58245 11.6337L4.34179 13.6199C4.23778 13.7864 4.35749 14.0023 4.55382 14.0023H15.4464C15.6427 14.0023 15.7624 13.7864 15.6584 13.6199L14.4178 11.6337C14.1448 11.1968 14.0001 10.692 14.0001 10.1768V7.99805C14.0001 5.78891 12.2092 3.99805 10.0001 3.99805Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
