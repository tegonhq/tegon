/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { WORKFLOW_CATEGORY_ICONS } from 'modules/team-settings/workflow/workflow-item';

import type { IssueType } from 'common/types/issue';
import type { WorkflowType } from 'common/types/team';

import { BoardColumn, BoardItem } from 'components/ui/board';
import { ScrollArea } from 'components/ui/scroll-area';
import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';
import { BoardIssueItem } from '../../issue-board-item';

interface CategoryBoardItemProps {
  workflow: WorkflowType;
}

export const CategoryBoardList = observer(
  ({ workflow }: CategoryBoardItemProps) => {
    const CategoryIcon =
      WORKFLOW_CATEGORY_ICONS[workflow.name] ??
      WORKFLOW_CATEGORY_ICONS['Backlog'];
    const currentTeam = useCurrentTeam();
    const { issuesStore, applicationStore } = useContextStore();
    const issues = issuesStore.getIssuesForState(
      workflow.id,
      currentTeam.id,
      applicationStore.displaySettings.showSubIssues,
    );
    const computedIssues = useFilterIssues(issues);

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }

    return (
      <BoardColumn key={workflow.id} id={workflow.id}>
        <div className="flex flex-col max-h-[100%]">
          <div className="flex items-center w-full p-4 pb-1">
            <CategoryIcon
              size={16}
              className="text-muted-foreground"
              color={workflow.color}
            />
            <h3 className="pl-2 text-sm font-medium">
              {workflow.name}
              <span className="text-muted-foreground ml-2">
                {computedIssues.length}
              </span>
            </h3>
          </div>

          <ScrollArea className="p-3 pb-10">
            <div className="flex flex-col gap-3 grow">
              {computedIssues.map((issue: IssueType, index: number) => (
                <BoardItem key={issue.id} id={issue.id}>
                  <Draggable
                    key={issue.id}
                    draggableId={issue.id}
                    index={index}
                  >
                    {(
                      dragProvided: DraggableProvided,
                      dragSnapshot: DraggableStateSnapshot,
                    ) => (
                      <BoardIssueItem
                        issueId={issue.id}
                        isDragging={dragSnapshot.isDragging}
                        provided={dragProvided}
                      />
                    )}
                  </Draggable>
                </BoardItem>
              ))}
            </div>
          </ScrollArea>
        </div>
      </BoardColumn>
    );
  },
);
