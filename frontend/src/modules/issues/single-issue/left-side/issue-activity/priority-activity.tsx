/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { PriorityIcons } from 'modules/issues/components';

import { cn } from 'common/lib/utils';
import { Priorities, type IssueHistoryType } from 'common/types/issue';

import { TimelineItem } from 'components/ui/timeline';

interface PriorityActivityProps {
  issueHistory: IssueHistoryType;
  username: string;
  showTime?: boolean;
}
export function PriorityActivity({
  issueHistory,
  username,
  showTime = false,
}: PriorityActivityProps) {
  const priorityText = Priorities[issueHistory.toPriority];
  const PriorityIcon = PriorityIcons[issueHistory.toPriority];

  return (
    <TimelineItem key={`${issueHistory.id}-removedLabels`} hasMore>
      <div className="flex items-center text-muted-foreground">
        <PriorityIcon.icon
          size={20}
          className={cn(
            'mr-4',
            issueHistory.toPriority === 1 && 'text-[#F9703E]',
          )}
        />

        <div className="flex items-center">
          <span className="text-foreground mr-2 font-medium">{username}</span>
          set priority to
          <span className="text-foreground mx-2 font-medium">
            {priorityText}
          </span>
        </div>

        {showTime && (
          <>
            <div className="mx-1">-</div>
            <div>
              <ReactTimeAgo date={new Date(issueHistory.updatedAt)} />
            </div>
          </>
        )}
      </div>
    </TimelineItem>
  );
}
