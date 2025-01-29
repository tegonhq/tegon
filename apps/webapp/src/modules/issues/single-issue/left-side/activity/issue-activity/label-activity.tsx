import { Badge, BadgeColor } from '@tegonhq/ui/components/badge';
import { TimelineItem } from '@tegonhq/ui/components/timeline';
import { LabelLine } from '@tegonhq/ui/icons';
import * as React from 'react';

import type { LabelType } from 'common/types';
import type { IssueHistoryType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

interface LabelActivityProps {
  issueHistory: IssueHistoryType;
  added: boolean;
  fullname: string;
  showTime?: boolean;
}
export function LabelActivity({
  added,
  issueHistory,
  fullname,
  showTime = false,
}: LabelActivityProps) {
  const { labelsStore } = useContextStore();

  const getLabel = React.useCallback((labelId: string) => {
    return labelsStore.labels.find((label: LabelType) => label.id === labelId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (added) {
    return (
      <TimelineItem
        key={`${issueHistory.id}-addedLabels`}
        hasMore
        date={showTime && issueHistory.updatedAt}
      >
        <div className="flex items-center text-muted-foreground">
          <LabelLine size={20} className="mr-2" />

          <div className="flex items-center">
            <span className="mr-2 text-foreground">{fullname}</span>
            added label
          </div>

          <div className="flex gap-1 ml-2">
            {issueHistory.addedLabelIds.map((labelId: string) => (
              <Badge variant="secondary" key={labelId}>
                <BadgeColor
                  style={{ backgroundColor: getLabel(labelId)?.color }}
                />
                {getLabel(labelId)?.name}
              </Badge>
            ))}
          </div>
        </div>
      </TimelineItem>
    );
  }

  return (
    <TimelineItem
      key={`${issueHistory.id}-removedLabels`}
      hasMore
      date={showTime && issueHistory.updatedAt}
    >
      <div className="flex items-center text-muted-foreground">
        <LabelLine size={20} className="mr-2" />

        <div className="flex items-center">
          <span className="mr-2 text-foreground">{fullname}</span>
          removed label
        </div>

        <div className="flex flex-wrap">
          {issueHistory.removedLabelIds.map((labelId: string) => (
            <Badge variant="secondary" key={labelId} className="ml-2">
              <BadgeColor
                style={{ backgroundColor: getLabel(labelId).color }}
              />
              {getLabel(labelId).name}
            </Badge>
          ))}
        </div>
      </div>
    </TimelineItem>
  );
}
