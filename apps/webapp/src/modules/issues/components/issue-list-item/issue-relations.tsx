import type { IssueType, WorkflowType } from '@tegonhq/types';

import { IssueRelationEnum } from '@tegonhq/types';
import { Button, buttonVariants } from '@tegonhq/ui/components/button';
import {
  BlockedFill,
  BlocksFill,
  ChevronRight,
  SubIssue,
} from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';

import { getWorkflowColor } from 'common/status-color';
import { WORKFLOW_CATEGORY_ICONS } from 'common/workflow-icons';

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

export const IssueRelations = observer(
  ({ issue, currentView, setCurrentView }: IssueRelationsProps) => {
    const { issueRelationsStore, issuesStore, workflowsStore, teamsStore } =
      useContextStore();

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

    if (
      !parentIssue &&
      blocksIssues.length === 0 &&
      blockedIssues.length === 0 &&
      subIssues.length === 0
    ) {
      return null;
    }

    function getParentComponent() {
      const workflows = workflowsStore.getWorkflowsForTeam(
        parentIssue.teamId,
      ) as WorkflowType[];

      const team = teamsStore.getTeamWithId(parentIssue.teamId);

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
          onClick={() => {
            push(
              `/${workspaceSlug}/issue/${team.identifier}-${parentIssue.number}`,
            );
          }}
        >
          Parent task
          <CategoryIcon
            size={16}
            color={getWorkflowColor(parentWorkflow).color}
          />
          <span className="font-mono">
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
          size="sm"
          onClick={() => setView(View.BLOCKED)}
        >
          <BlockedFill className="h-4 w-4 text-red-500" />
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
          className="flex gap-1 text-xs items-center"
          variant="secondary"
          size="sm"
          onClick={() => setView(View.BLOCKS)}
        >
          <BlocksFill className="h-4 w-4 text-orange-500" />
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
          className="flex gap-1 text-xs items-center"
          variant="secondary"
          size="sm"
          onClick={() => setView(View.SUB_ISSUES)}
        >
          <SubIssue className="h-4 w-4" />
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
      <div className="flex flex-col w-fit">
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
  },
);
