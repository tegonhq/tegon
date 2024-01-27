/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'lib/utils';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

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
}

const Loader = React.forwardRef<HTMLButtonElement, LoaderProps>(
  ({ height = 300, size }) => {
    console.log(height);
    return (
      <div
        className={cn(loaderVariants({ size }), `h-[${height}px]`, 'w-full')}
      >
        <Loader2 className="animate-spin mr-2" />
      </div>
    );
  },
);

Loader.displayName = 'Loader';

export { Loader, loaderVariants };
