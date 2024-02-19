/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiLoader4Line } from '@remixicon/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from 'common/lib/utils';

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
    return (
      <div
        className={cn(loaderVariants({ size }), `h-[${height}px]`, 'w-full')}
      >
        <RiLoader4Line className="animate-spin mr-2" />
      </div>
    );
  },
);

Loader.displayName = 'Loader';

export { Loader, loaderVariants };
