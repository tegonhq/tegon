/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React, { type ReactNode } from 'react';
import ReactTimeAgo from 'react-time-ago';

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
  date?: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  children,
  className,
  hasMore,
  date,
}) => (
  <>
    {hasMore && (
      <React.Fragment>
        <div className={cn('h-3 w-[1px] bg-border self-stretch ml-2.5')}></div>
      </React.Fragment>
    )}
    <div className={cn('flex items-center w-full', className)}>
      <TimelineContent>
        <div className="flex justify-between items-start">
          <div className="w-full">{children}</div>
          {date && (
            <div className="font-mono text-muted-foreground text-sm shrink-0">
              <ReactTimeAgo date={new Date(date)} />
            </div>
          )}
        </div>
      </TimelineContent>
    </div>
  </>
);
TimelineItem.displayName = 'TimelineItem';

interface TimelineProps {
  children: React.ReactNode;
}

const Timeline: React.FC<TimelineProps> = ({ children }) => {
  return (
    <div className={cn('flex flex-col items-start gap-1')}>{children}</div>
  );
};
Timeline.displayName = 'Timeline';

export { Timeline, TimelineItem };
