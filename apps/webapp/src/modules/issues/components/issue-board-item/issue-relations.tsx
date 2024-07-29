import type { IssueType } from '@tegonhq/types';

import { IssueRelationEnum } from '@tegonhq/types';
import { WORKFLOW_CATEGORY_ICONS } from '@tegonhq/types';
import { buttonVariants } from '@tegonhq/ui/components/button';
import { BlockedFill, BlocksFill, SubIssue } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { getWorkflowColor } from 'common/status-color';

import { useTeamWithId } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

interface IssueRelationsProps {
  issue: IssueType;
}

export const IssueRelations = observer(({ issue }: IssueRelationsProps) => {
  const { issueRelationsStore, issuesStore } = useContextStore();
  const team = useTeamWithId(issue.teamId);
  const workflows = useTeamWorkflows(team.identifier);

  const blockedIssues = issueRelationsStore.getIssueRelationForType(
    issue.id,
    IssueRelationEnum.BLOCKED,
  );
  const blocksIssues = issueRelationsStore.getIssueRelationForType(
    issue.id,
    IssueRelationEnum.BLOCKS,
  );
  const parentIssue = issuesStore.getIssueById(issue.parentId);
  const subIssues = issuesStore.getSubIssues(issue.id);

  if (!parentIssue && blocksIssues.length === 0 && blockedIssues.length === 0) {
    return null;
  }

  function getParentComponent() {
    const parentWorkflow =
      parentIssue &&
      workflows.find((workflow) => workflow.id === parentIssue.stateId);
    const CategoryIcon = WORKFLOW_CATEGORY_ICONS[parentWorkflow.name];

    return (
      <a
        className={cn(
          buttonVariants({ size: 'sm', variant: 'secondary' }),
          'text-xs flex gap-1',
        )}
      >
        Parent task{' '}
        <CategoryIcon
          size={12}
          color={getWorkflowColor(parentWorkflow).color}
        />{' '}
        <span>
          {team.identifier}-{parentIssue.number}
        </span>
      </a>
    );
  }

  function getBlockedByComponent() {
    return (
      <div className="flex gap-1 text-xs items-center bg-grayAlpha-100 h-5 rounded-sm px-2">
        <BlockedFill className="h-3 w-3 text-red-500" />
        <div>Blocked by</div>
        <div className="text-muted-foreground">{blockedIssues.length}</div>
      </div>
    );
  }

  function getBlocksByComponent() {
    return (
      <div className="flex gap-1 text-xs items-center bg-grayAlpha-100 h-5 rounded-sm px-2">
        <BlocksFill className="h-3 w-3 text-orange-500" />
        <div>Blocks</div>
        <div className="text-muted-foreground">{blocksIssues.length}</div>
      </div>
    );
  }

  function getSubIssuesComponent() {
    return (
      <div className="flex gap-1 text-xs items-center bg-grayAlpha-100 h-5 rounded-sm px-2">
        <SubIssue className="h-3 w-3" />
        <div>Sub-issues</div>
        <div className="text-muted-foreground">{subIssues.length}</div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-wrap gap-1"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {issue.parentId && getParentComponent()}
      {blockedIssues.length > 0 && getBlockedByComponent()}
      {blocksIssues.length > 0 && getBlocksByComponent()}
      {subIssues.length > 0 && getSubIssuesComponent()}
    </div>
  );
});
