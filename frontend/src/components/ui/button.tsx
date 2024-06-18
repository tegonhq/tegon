/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Slot } from '@radix-ui/react-slot';
import { RiLoader4Line } from '@remixicon/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from 'common/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:shadow-none disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-slate-50 shadow hover:bg-primary/90 dark:bg-primary dark:text-slate-50 dark:hover:bg-primary/90',
        destructive: 'text-red-500 bg-grayAlpha-100 border-none',
        outline:
          'border border-slate-300 shadow-sm hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 dark:text-slate-50 dark:hover:text-slate-100 shadow-none',
        secondary: 'bg-grayAlpha-100 border-none',
        ghost: 'dark:focus-visible:ring-0',
        link: 'text-blue-600 underline-offset-4 hover:underline dark:text-blue-600',
      },
      size: {
        default: 'h-8 px-4 py-2',
        sm: 'h-7 rounded-md px-2 py-1',
        xs: 'h-5 rounded-sm px-2',
        lg: 'h-9 rounded-md px-8',
        xl: 'h-14 rounded-md px-8',
        icon: 'h-9 w-9',
      },
      full: {
        false: 'w-auto',
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      full: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
  isActive?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      full,
      asChild = false,
      children,
      isLoading,
      isActive,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, full, className }),
          isActive && 'bg-active  dark:hover:bg-slate-800',
        )}
        ref={ref}
        type="button"
        {...props}
        disabled={isLoading ?? disabled}
      >
        {isLoading ? <RiLoader4Line className="animate-spin mr-2" /> : <></>}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
