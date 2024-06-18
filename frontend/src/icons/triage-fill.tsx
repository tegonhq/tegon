/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IconProps } from './types';

export function TriageFill({ size = 18, className, color }: IconProps) {
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.72875 1.5C7.91879 1.5 6.50962 1.82576 5.2966 2.47473C4.09457 3.11097 3.11144 4.09371 2.47473 5.29549C1.82585 6.50948 1.5 7.91856 1.5 9.72875V10.2712C1.5 12.0814 1.82582 13.4904 2.47466 14.7044C3.11109 15.9061 4.09389 16.8889 5.29559 17.5253C6.50956 18.1742 7.91862 18.5 9.72875 18.5H10.2712C12.0813 18.5 13.4904 18.1742 14.7043 17.5254C15.9061 16.8889 16.8889 15.9061 17.5254 14.7043C18.1742 13.4904 18.5 12.0813 18.5 10.2712V9.72875C18.5 7.91862 18.1742 6.50956 17.5253 5.29559C16.8889 4.09389 15.9061 3.1111 14.7044 2.47466C13.4904 1.82582 12.0814 1.5 10.2712 1.5H9.72875ZM5.21934 9.46918L7.21934 7.46918C7.36152 7.3367 7.54956 7.26457 7.74386 7.268C7.93816 7.27143 8.12355 7.35014 8.26096 7.48756C8.39838 7.62497 8.47709 7.81035 8.48052 8.00465C8.48394 8.19896 8.41182 8.387 8.27934 8.52918L7.55934 9.24918H9.24934H10.7493H12.4393L11.7193 8.52918C11.6457 8.46051 11.5866 8.37771 11.5456 8.28572C11.5046 8.19372 11.4825 8.0944 11.4807 7.9937C11.479 7.893 11.4975 7.79297 11.5352 7.69958C11.5729 7.60619 11.6291 7.52136 11.7003 7.45014C11.7715 7.37892 11.8564 7.32277 11.9497 7.28505C12.0431 7.24733 12.1432 7.22881 12.2439 7.23059C12.3446 7.23236 12.4439 7.2544 12.5359 7.2954C12.6279 7.33639 12.7107 7.39549 12.7793 7.46918L14.7793 9.46918C14.9198 9.6098 14.9987 9.80043 14.9987 9.99918C14.9987 10.1979 14.9198 10.3886 14.7793 10.5292L12.7793 12.5292C12.6387 12.6696 12.4481 12.7485 12.2493 12.7485C12.0506 12.7485 11.86 12.6696 11.7193 12.5292C11.5789 12.3886 11.5 12.1979 11.5 11.9992C11.5 11.8004 11.5789 11.6098 11.7193 11.4692L12.4393 10.7492H10.7493H9.24934H7.55934L8.27934 11.4692C8.41182 11.6114 8.48394 11.7994 8.48052 11.9937C8.47709 12.188 8.39838 12.3734 8.26096 12.5108C8.12355 12.6482 7.93816 12.7269 7.74386 12.7304C7.54956 12.7338 7.36152 12.6617 7.21934 12.5292L5.21934 10.5292C5.07889 10.3886 5 10.1979 5 9.99918C5 9.80043 5.07889 9.6098 5.21934 9.46918Z"
        fill="#D94B0E"
      />
    </svg>
  );
}
