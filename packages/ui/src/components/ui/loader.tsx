import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Loader as LoaderI } from '../../icons';
import { cn } from '../../lib/utils';

const loaderVariants = cva(
  'flex items-center justify-center whitespace-nowrap',
  {
    variants: {
      size: {
        default: 'px-4 py-2',
        sm: 'rounded-md px-3 text-xs',
        lg: 'rounded-md px-8',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export interface LoaderProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof loaderVariants> {
  height?: number;
  text?: string;
  variant?: 'horizontal' | 'vertical';
}

const Loader = React.forwardRef<HTMLButtonElement, LoaderProps>(
  ({ height = 300, size, text, variant = 'vertical' }) => {
    return (
      <div
        className={cn(
          loaderVariants({ size }),
          `h-[${height}px]`,
          'w-full flex flex-wrap',
          variant === 'horizontal' ? 'items-center gap-1' : 'flex-col gap-2',
        )}
      >
        <LoaderI size={18} className="animate-spin" />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    );
  },
);

Loader.displayName = 'Loader';

export { Loader, loaderVariants };
