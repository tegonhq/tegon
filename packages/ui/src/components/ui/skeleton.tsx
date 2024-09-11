import React from 'react';

import { cn } from '../../lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded bg-grayAlpha-200', className)}
      {...props}
    />
  );
}

export { Skeleton };
