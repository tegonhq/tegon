/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from 'common/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-2 rounded-md border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground bg-slate-50 dark:bg-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

interface BadgeColorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function BadgeColor({ className, ...otherProps }: BadgeColorProps) {
  return (
    <span
      className={cn('rounded-full', `w-[8px] h-[8px]`, className)}
      {...otherProps}
    ></span>
  );
}

export { Badge, badgeVariants, BadgeColor };
