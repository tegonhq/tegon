import type { IconProps } from './types';

export function Project({ size = 18, className, color }: IconProps) {
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
        d="M7.52561 1.23779C7.83993 1.18742 8.16027 1.18742 8.47459 1.23779C8.83027 1.29479 9.16691 1.43613 9.65331 1.64034C9.67435 1.64916 9.69563 1.65808 9.71715 1.66713L13.2547 3.15114C13.2796 3.16158 13.3043 3.1719 13.3288 3.18213C13.6803 3.32904 13.9892 3.45812 14.226 3.67842C14.4332 3.87122 14.592 4.11019 14.6896 4.37592C14.8012 4.67953 14.8007 5.01444 14.8002 5.3956C14.8001 5.42214 14.8001 5.44892 14.8001 5.47592V10.0983C14.8001 10.1299 14.8001 10.161 14.8002 10.1917C14.8006 10.7153 14.801 11.1262 14.6652 11.496C14.5458 11.8208 14.3517 12.1129 14.0984 12.3485C13.81 12.6169 13.4311 12.7755 12.9483 12.9775C12.92 12.9894 12.8912 13.0014 12.8622 13.0135L9.71715 14.3329C9.69563 14.3419 9.67435 14.3509 9.65331 14.3597C9.16699 14.5639 8.83027 14.7052 8.47459 14.7623C8.16027 14.8126 7.83993 14.8126 7.52561 14.7623C7.1699 14.7052 6.83325 14.5639 6.34686 14.3597C6.32587 14.3509 6.3046 14.3419 6.28303 14.3329L3.13804 13.0135C3.10898 13.0014 3.08027 12.9894 3.05192 12.9775C2.5691 12.7755 2.19022 12.6169 1.90179 12.3485C1.64853 12.1129 1.45437 11.8208 1.33508 11.496C1.19923 11.1262 1.19958 10.7153 1.20005 10.1917C1.20007 10.161 1.2001 10.1299 1.2001 10.0983V5.47592C1.2001 5.44892 1.20006 5.42214 1.20002 5.39559C1.19949 5.01444 1.19902 4.67953 1.31054 4.37592C1.40814 4.11019 1.56699 3.87122 1.77421 3.67842C2.01098 3.45812 2.3199 3.32904 2.67146 3.18213C2.69596 3.1719 2.72066 3.16158 2.74555 3.15114L6.28303 1.66713C6.3046 1.65808 6.32587 1.64916 6.34687 1.64034C6.83325 1.43613 7.1699 1.29479 7.52561 1.23779V1.23779ZM8.60011 13.4898C8.74883 13.4362 8.94771 13.3539 9.25307 13.2259L12.3981 11.9065C13.0089 11.6503 13.1696 11.5732 13.2812 11.4695C13.3963 11.3624 13.4845 11.2296 13.5388 11.082C13.5912 10.9391 13.6001 10.761 13.6001 10.0983V5.49772L9.71715 7.12664C9.69563 7.13568 9.67435 7.14462 9.65331 7.15344C9.22267 7.33423 8.90947 7.46576 8.59643 7.53309C8.59883 7.55501 8.60011 7.57729 8.60011 7.59987V13.4898ZM7.40377 7.53309C7.09074 7.46576 6.77749 7.33423 6.34686 7.15343C6.32587 7.14462 6.3046 7.13568 6.28303 7.12664L2.4001 5.49772V10.0983C2.4001 10.761 2.40894 10.9391 2.46146 11.082C2.51568 11.2296 2.60393 11.3624 2.71905 11.4695C2.83054 11.5732 2.99128 11.6503 3.60212 11.9065L6.7471 13.2259C7.05246 13.3539 7.25133 13.4362 7.4001 13.4898V7.59987C7.4001 7.57729 7.40134 7.55501 7.40377 7.53309ZM2.88236 4.39831L6.7471 6.0196C7.32165 6.26063 7.51918 6.33921 7.7154 6.37065C7.904 6.40088 8.09619 6.40088 8.28483 6.37065C8.48099 6.33921 8.67859 6.26063 9.25307 6.0196L9.83355 5.7761L5.00806 3.75177C4.92153 3.71548 4.84798 3.66126 4.78989 3.59524L3.20962 4.25817C3.06999 4.31675 2.96398 4.36208 2.88236 4.39831V4.39831ZM6.26389 2.97688L11.385 5.12524L13.1179 4.39831C13.0362 4.36208 12.9302 4.31675 12.7906 4.25817L9.25307 2.77417C8.67859 2.53315 8.48099 2.45456 8.28483 2.42312C8.09619 2.3929 7.904 2.3929 7.7154 2.42312C7.51918 2.45456 7.32165 2.53315 6.7471 2.77417L6.26389 2.97688Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
