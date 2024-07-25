import { RiFileTransferLine } from '@remixicon/react';
import { TimelineItem } from '@tegonhq/ui/components/timeline';
import {
  BlockedFill,
  BlocksFill,
  DuplicateLine,
} from '@tegonhq/ui/icons/index';
import { cn } from '@tegonhq/ui/lib/utils';
import { useRouter } from 'next/router';

import { type IssueHistoryType } from 'common/types/issue';
import { IssueRelationEnum } from 'common/types/issue-relation';

import { useTeamWithId } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

interface StatusActivityProps {
  issueHistory: IssueHistoryType;
  username: string;
  showTime?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, { icon: any; color: string }> = {
  [IssueRelationEnum.BLOCKS]: {
    icon: BlocksFill,
    color: 'text-red-500',
  },
  [IssueRelationEnum.BLOCKED]: {
    icon: BlockedFill,
    color: 'text-red-500',
  },
  [IssueRelationEnum.RELATED]: {
    icon: RiFileTransferLine,
    color: 'text-muted-foreground',
  },
  [IssueRelationEnum.DUPLICATE]: {
    icon: DuplicateLine,
    color: 'text-muted-foreground',
  },
  [IssueRelationEnum.DUPLICATE_OF]: {
    icon: DuplicateLine,
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

    if (relatedChanges.type === IssueRelationEnum.DUPLICATE_OF) {
      return (
        <div className="flex items-center">
          <span className="text-foreground mr-2 font-medium">{username}</span>
          <span>
            {relatedChanges.isDeleted ? 'removed' : 'marked'} this issue as
            duplicate of
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

    if (relatedChanges.type === IssueRelationEnum.DUPLICATE) {
      return (
        <div className="flex items-center">
          <span className="text-foreground mr-2 font-medium">{username}</span>
          <span>
            {relatedChanges.isDeleted ? 'removed' : 'marked'} this issue as
            duplicated by
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
    <TimelineItem
      key={`${issueHistory.id}-removedLabels`}
      hasMore
      date={showTime && issueHistory.updatedAt}
    >
      <div className="flex items-center text-muted-foreground">
        <div className="h-[15px] w-[20px] flex items-center justify-center mr-4">
          <Icon.icon
            size={20}
            className={cn(
              'text-muted-foreground',
              !relatedChanges.isDeleted && Icon.color,
            )}
          />
        </div>

        {getText()}
      </div>
    </TimelineItem>
  );
}
