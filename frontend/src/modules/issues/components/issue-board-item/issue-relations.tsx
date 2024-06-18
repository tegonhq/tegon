/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';

import { WORKFLOW_CATEGORY_ICONS } from 'common/types/status';

import { cn } from 'common/lib/utils';
import type { IssueType } from 'common/types/issue';
import { IssueRelationEnum } from 'common/types/issue-relation';

import { buttonVariants } from 'components/ui/button';
import { useTeamWithId } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';
import { BlockedFill, BlocksFill, SubIssue } from 'icons';

import { useContextStore } from 'store/global-context-provider';

interface IssueRelationsProps {
  issue: IssueType;
}

export function IssueRelations({ issue }: IssueRelationsProps) {
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
          buttonVariants({ size: 'xs', variant: 'secondary' }),
          'text-xs flex gap-1',
        )}
      >
        Parent task <CategoryIcon size={12} color={parentWorkflow.color} />{' '}
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
}
