import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '../../lib/utils';

interface ProgressSegment {
  value: number;
}

type Props = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  color?: string;
  segments: ProgressSegment[];
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  Props
>(({ className, segments, color, ...props }, ref) => {
  const sortedSegments = segments.sort((a, b) => b.value - a.value);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn('relative h-3 w-full overflow-hidden rounded', className)}
      style={{
        backgroundColor: `${color}33`,
      }}
      {...props}
    >
      {sortedSegments.map((segment, index) => (
        <ProgressPrimitive.Indicator
          key={index}
          className="h-full transition-all absolute top-0 bg-primary"
          style={{
            width: `${segment.value}%`,
            left: '0%',
            backgroundColor: `${color}${Math.round(
              90 + ((100 - 30) * index) / (sortedSegments.length - 1),
            )
              .toString(16)
              .padStart(2, '0')}`,
            zIndex: sortedSegments.length - index,
          }}
        />
      ))}
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = 'Progress';

export { Progress };
