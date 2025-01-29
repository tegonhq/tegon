import type { IconProps } from './types';

export function HelpCentre({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 7.99782C1 4.13182 4.13401 0.997803 8.00002 0.997803C11.866 0.997803 15 4.13179 15 7.99777L15 9.25207L15 10.5021C15 11.6542 14.2206 12.6244 13.1603 12.914C12.8285 14.2578 11.6148 15.2543 10.1685 15.2543H7C6.58579 15.2543 6.25 14.9185 6.25 14.5043C6.25 14.0901 6.58579 13.7543 7 13.7543H10.1685C10.8048 13.7543 11.3533 13.3785 11.6043 12.8368C10.666 12.4766 10 11.5671 10 10.5021V8.49782C10 7.1171 11.1193 5.9978 12.5 5.9978C12.7279 5.9978 12.9487 6.0283 13.1584 6.08542C12.3815 3.99062 10.3651 2.4978 8.00002 2.4978C5.63492 2.4978 3.6185 3.99062 2.84159 6.08541C3.05138 6.02829 3.27214 5.9978 3.50002 5.9978C4.88073 5.9978 6.00003 7.11709 6.00003 8.49781L6.00004 10.5021C6.00004 11.8828 4.88074 13.0021 3.50002 13.0021C2.1193 13.0021 1 11.8828 1 10.5021V7.99782ZM2.5 10.5021C2.5 11.0544 2.94772 11.5021 3.50002 11.5021C4.05231 11.5021 4.50004 11.0544 4.50004 10.5021L4.50003 8.49782C4.50003 7.94552 4.05231 7.4978 3.50002 7.4978C2.94772 7.4978 2.5 7.94553 2.5 8.49782V10.5021ZM12.7583 11.4684C13.1854 11.3545 13.5 10.965 13.5 10.5021L13.5 8.49782C13.5 7.94552 13.0523 7.4978 12.5 7.4978C11.9477 7.4978 11.5 7.94552 11.5 8.49782V10.5021C11.5 10.965 11.8146 11.3545 12.2417 11.4684C12.3222 11.4388 12.4092 11.4227 12.5 11.4227C12.5908 11.4227 12.6778 11.4388 12.7583 11.4684Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}
