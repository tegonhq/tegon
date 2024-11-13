import { TimelineItem } from '@tegonhq/ui/components/timeline';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { PriorityIcons } from 'modules/issues/components';

import { type IssueHistoryType } from 'common/types';

import { usePriorities } from 'hooks/priorities';

interface PriorityActivityProps {
  issueHistory: IssueHistoryType;
  fullname: string;
  showTime?: boolean;
}
export const PriorityActivity = observer(
  ({ issueHistory, fullname, showTime = false }: PriorityActivityProps) => {
    const Priorities = usePriorities();

    const priorityText = Priorities[issueHistory.toPriority];
    const PriorityIcon = PriorityIcons[issueHistory.toPriority];

    return (
      <TimelineItem
        key={`${issueHistory.id}-removedLabels`}
        hasMore
        date={showTime && issueHistory.updatedAt}
      >
        <div className="flex items-center text-muted-foreground">
          <PriorityIcon.icon
            size={20}
            className={cn(
              'mr-2',
              issueHistory.toPriority === 1 && 'text-[#F9703E]',
            )}
          />

          <div className="flex items-center">
            <span className="text-foreground mr-2">{fullname}</span>
            set priority to
            <span className="text-foreground mx-2">{priorityText}</span>
          </div>
        </div>
      </TimelineItem>
    );
  },
);
