/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiFileForbidLine,
  RiFileTransferLine,
  RiFileWarningLine,
  type RemixiconComponentType,
} from '@remixicon/react';
import { useRouter } from 'next/router';
import ReactTimeAgo from 'react-time-ago';

import { cn } from 'common/lib/utils';
import { type IssueHistoryType } from 'common/types/issue';
import { IssueRelationEnum } from 'common/types/issue-relation';

import { TimelineItem } from 'components/ui/timeline';
import { useTeamWithId } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

interface StatusActivityProps {
  issueHistory: IssueHistoryType;
  username: string;
  showTime?: boolean;
}

const ICON_MAP: Record<
  string,
  { icon: RemixiconComponentType; color: string }
> = {
  [IssueRelationEnum.BLOCKS]: {
    icon: RiFileForbidLine,
    color: 'text-red-700 dark:text-red-400',
  },
  [IssueRelationEnum.BLOCKED]: {
    icon: RiFileWarningLine,
    color: 'text-red-700 dark:text-red-400',
  },
  [IssueRelationEnum.RELATED]: {
    icon: RiFileTransferLine,
    color: 'text-muted-foreground',
  },
};

export function RelatedActivity({
  issueHistory,
  username,
  showTime = false,
}: StatusActivityProps) {
  const relatedChanges = issueHistory.relationChanges;
  const Icon = ICON_MAP[relatedChanges.type];
  const {
    query: { workspaceSlug },
  } = useRouter();
  const { issuesStore } = useContextStore();
  const relatedIssue = issuesStore.getIssueById(relatedChanges.relatedIssueId);
  const team = useTeamWithId(relatedIssue.teamId);

  const getText = () => {
    if (relatedChanges.type === IssueRelationEnum.RELATED) {
      return (
        <div className="flex items-center">
          <span className="text-foreground mr-2 font-medium">{username}</span>
          <span>
            {relatedChanges.isDeleted ? 'removed' : 'added'} related issue
          </span>
          <a
            className="text-foreground mx-1"
            href={`/${workspaceSlug}/issue/${team.identifier}-${relatedIssue.number}`}
          >
            {team.identifier}-{relatedIssue.number}
          </a>
        </div>
      );
    }

    if (relatedChanges.type === IssueRelationEnum.BLOCKED) {
      return (
        <div className="flex items-center">
          <span className="text-foreground mr-2 font-medium">{username}</span>
          <span>
            {relatedChanges.isDeleted ? 'removed' : 'marked'} this issue as
            being blocked by
          </span>
          <a
            className="text-foreground mx-1"
            href={`/${workspaceSlug}/issue/${team.identifier}-${relatedIssue.number}`}
          >
            {team.identifier}-{relatedIssue.number}
          </a>
        </div>
      );
    }

    if (relatedChanges.type === IssueRelationEnum.BLOCKS) {
      return (
        <div className="flex items-center">
          <span className="text-foreground mr-2 font-medium">{username}</span>
          <span>
            {relatedChanges.isDeleted ? 'removed' : 'marked'} this issue as
            blocking
          </span>
          <a
            className="text-foreground mx-1"
            href={`/${workspaceSlug}/issue/${team.identifier}-${relatedIssue.number}`}
          >
            {team.identifier}-{relatedIssue.number}
          </a>
        </div>
      );
    }

    return null;
  };

  return (
    <TimelineItem key={`${issueHistory.id}-removedLabels`} hasMore>
      <div className="flex items-center text-xs text-muted-foreground">
        <div className="h-[20px] w-[25px] flex items-center justify-center mr-4">
          <Icon.icon
            size={18}
            className={cn(
              'text-muted-foreground',
              !relatedChanges.isDeleted && Icon.color,
            )}
          />
        </div>

        {getText()}
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
