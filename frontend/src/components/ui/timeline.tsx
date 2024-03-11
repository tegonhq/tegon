/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React, { type ReactNode } from 'react';

import { cn } from 'common/lib/utils';

interface TimelineContentProps {
  children: ReactNode;
}

const TimelineContent: React.FC<TimelineContentProps> = ({ children }) => (
  <div className="w-full">{children}</div>
);
TimelineContent.displayName = 'TimelineContent';

interface TimelineItemProps {
  children: React.ReactNode;
  className?: string;
  hasMore: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  children,
  className,
  hasMore,
}) => (
  <>
    {hasMore && (
      <React.Fragment>
        <div
          className={cn(
            'h-3 w-[1px] dark:bg-slate-700 bg-slate-300 self-stretch ml-3',
          )}
        ></div>
      </React.Fragment>
    )}
    <div className={cn('flex items-center', className)}>
      <TimelineContent>{children}</TimelineContent>
    </div>
  </>
);
TimelineItem.displayName = 'TimelineItem';

interface TimelineProps {
  children: React.ReactNode;
}

const Timeline: React.FC<TimelineProps> = ({ children }) => {
  return <div className={cn('flex flex-col items-start')}>{children}</div>;
};
Timeline.displayName = 'Timeline';

export { Timeline, TimelineItem };
