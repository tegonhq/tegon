import { buttonVariants } from '@tegonhq/ui/components/button';
import { BlockedFill, BlocksFill, SubIssue } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';

import { getWorkflowColor } from 'common/status-color';
import { IssueRelationEnum } from 'common/types';
import type { IssueType, WorkflowType } from 'common/types';
import { getWorkflowIcon } from 'common/workflow-icons';

import { useTeamWithId } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

interface IssueRelationsProps {
  issue: IssueType;
}

export const IssueRelations = observer(({ issue }: IssueRelationsProps) => {
  const { issueRelationsStore, issuesStore, workflowsStore } =
    useContextStore();
  const team = useTeamWithId(issue.teamId);
  const {
    push,
    query: { workspaceSlug },
  } = useRouter();
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
    const workflows = workflowsStore.getWorkflowsForTeam(
      parentIssue.teamId,
    ) as WorkflowType[];

    const parentWorkflow =
      parentIssue &&
      workflows.find((workflow) => workflow.id === parentIssue.stateId);
    const CategoryIcon = getWorkflowIcon(parentWorkflow);

    return (
      <a
        className={cn(
          buttonVariants({ size: 'sm', variant: 'secondary' }),
          'text-xs flex gap-1 shrink min-w-[0px]',
        )}
        onClick={() => {
          push(
            `/${workspaceSlug}/issue/${team.identifier}-${parentIssue.number}`,
          );
        }}
      >
        Parent
        <CategoryIcon
          size={16}
          color={getWorkflowColor(parentWorkflow).color}
          className="shrink-0"
        />
        <span className="font-mono text-muted-foreground shrink-0">
          {team.identifier}-{parentIssue.number}
        </span>
        <span className="truncate">{parentIssue.title}</span>
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
