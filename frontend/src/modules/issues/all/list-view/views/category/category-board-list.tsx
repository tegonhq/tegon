/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { BoardIssueItem } from 'modules/issues/components/issue-board-item';

import type { IssueType } from 'common/types/issue';
import { WORKFLOW_CATEGORY_ICONS } from 'common/types/status';
import type { WorkflowType } from 'common/types/team';

import { BoardColumn, BoardItem } from 'components/ui/board';
import { ScrollArea } from 'components/ui/scroll-area';
import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';

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
    const computedIssues = useFilterIssues(issues, currentTeam.id);

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }

    return (
      <BoardColumn key={workflow.id} id={workflow.id}>
        <div className="flex flex-col max-h-[100%] pr-4">
          <div className="flex gap-1 items-center mb-2">
            <div
              className="flex items-center w-fit h-8 rounded-2xl px-4 py-2"
              style={{ backgroundColor: workflow.color }}
            >
              <CategoryIcon size={20} />
              <h3 className="pl-2">{workflow.name}</h3>
            </div>

            <div className="rounded-lg bg-grayAlpha-100 p-1.5 px-2">
              {computedIssues.length}
            </div>
          </div>

          <ScrollArea>
            <div className="flex flex-col gap-1 grow pb-10">
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
