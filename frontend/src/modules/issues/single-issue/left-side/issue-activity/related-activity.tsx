/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiFileForbidLine,
  RiFileTransferLine,
  RiFileWarningLine,
} from '@remixicon/react';
import { type IssueHistoryType } from 'common/types/issue';
import { IssueRelationEnum } from 'common/types/issue-relation';
import { TimelineItem } from 'components/ui/timeline';

interface StatusActivityProps {
  issueHistory: IssueHistoryType;
  username: string;
  showTime?: boolean;
}

const ICON_MAP = {
  [IssueRelationEnum.BLOCKS]: RiFileForbidLine,
  [IssueRelationEnum.BLOCKED]: RiFileWarningLine,
  [IssueRelationEnum.RELATED]: RiFileTransferLine,
};

export function RelatedActivity({
  issueHistory,
  username,
  showTime = false,
}: StatusActivityProps) {
  return (
    <TimelineItem
      className="my-2"
      key={`${issueHistory.id}-removedLabels`}
      hasMore
    >
      asdf
    </TimelineItem>
  );
}
