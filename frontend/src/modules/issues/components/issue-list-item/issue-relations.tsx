/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';

import { WORKFLOW_CATEGORY_ICONS } from 'common/types/status';

import { cn } from 'common/lib/utils';
import type { IssueType } from 'common/types/issue';
import { IssueRelationEnum } from 'common/types/issue-relation';

import { Button, buttonVariants } from 'components/ui/button';
import { useTeamWithId } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';
import {
  BlockedFill,
  BlockedLine,
  BlocksFill,
  ChevronRight,
  SubIssue,
} from 'icons';

import { useContextStore } from 'store/global-context-provider';

export enum View {
  BLOCKED = 'BLOCKED',
  BLOCKS = 'BLOCKS',
  SUB_ISSUES = 'SUB_ISSUES',
}

interface IssueRelationsProps {
  issue: IssueType;
  currentView: View;
  setCurrentView: (view: View) => void;
}

export function IssueRelations({
  issue,
  currentView,
  setCurrentView,
}: IssueRelationsProps) {
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

  function setView(view: View) {
    if (currentView === view) {
      setCurrentView(undefined);
    } else {
      setCurrentView(view);
    }
  }

  function getBlockedByComponent() {
    return (
      <Button
        className="flex gap-1 text-xs items-center"
        variant="secondary"
        size="xs"
        onClick={() => setView(View.BLOCKED)}
      >
        <BlockedFill className="h-3 w-3 text-red-500" />
        <div>Blocked by</div>
        <div className="text-muted-foreground">{blockedIssues.length}</div>
        <div>
          <ChevronRight
            className={cn(
              'h-3 w-3 transition-transform duration-200',
              currentView === View.BLOCKED && 'rotate-90',
            )}
          />
        </div>
      </Button>
    );
  }

  function getBlocksByComponent() {
    return (
      <Button
        className="flex gap-1 text-xs"
        variant="secondary"
        size="xs"
        onClick={() => setView(View.BLOCKS)}
      >
        <BlocksFill className="h-3 w-3 text-orange-500" />
        <div>Blocks</div>
        <div className="text-muted-foreground">{blocksIssues.length}</div>
        <div>
          <ChevronRight
            className={cn(
              'h-3 w-3 transition-transform duration-200',
              currentView === View.BLOCKS && 'rotate-90',
            )}
          />
        </div>
      </Button>
    );
  }

  function getSubIssuesComponent() {
    return (
      <Button
        className="flex gap-1 text-xs"
        variant="secondary"
        size="xs"
        onClick={() => setView(View.SUB_ISSUES)}
      >
        <SubIssue className="h-3 w-3" />
        <div>Sub-issue</div>
        <div className="text-muted-foreground">{subIssues.length}</div>
        <div>
          <ChevronRight
            className={cn(
              'h-3 w-3 transition-transform duration-200',
              currentView === View.SUB_ISSUES && 'rotate-90',
            )}
          />
        </div>
      </Button>
    );
  }

  return (
    <div className="flex flex-col">
      <div
        className="flex gap-2 pt-1"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {issue.parentId && getParentComponent()}
        {blockedIssues.length > 0 && getBlockedByComponent()}
        {blocksIssues.length > 0 && getBlocksByComponent()}
        {subIssues.length > 0 && getSubIssuesComponent()}
      </div>
    </div>
  );
}
