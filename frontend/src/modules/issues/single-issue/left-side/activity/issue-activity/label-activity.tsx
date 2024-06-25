/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import type { IssueHistoryType } from 'common/types/issue';
import type { LabelType } from 'common/types/label';

import { Badge, BadgeColor } from 'components/ui/badge';
import { TimelineItem } from 'components/ui/timeline';
import { LabelLine } from 'icons';

import { useContextStore } from 'store/global-context-provider';

interface LabelActivityProps {
  issueHistory: IssueHistoryType;
  added: boolean;
  username: string;
  showTime?: boolean;
}
export function LabelActivity({
  added,
  issueHistory,
  username,
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
          <LabelLine size={20} className="mr-4" />

          <div className="flex items-center">
            <span className="mr-2 font-medium text-foreground">{username}</span>
            added label
          </div>

          <div>
            {issueHistory.addedLabelIds.map((labelId: string) => (
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

  return (
    <TimelineItem
      key={`${issueHistory.id}-removedLabels`}
      hasMore
      date={showTime && issueHistory.updatedAt}
    >
      <div className="flex items-center text-muted-foreground">
        <LabelLine size={20} className="mr-4" />

        <div className="flex items-center">
          <span className="mr-2 font-medium text-foreground">{username}</span>
          removed label
        </div>

        <div>
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
