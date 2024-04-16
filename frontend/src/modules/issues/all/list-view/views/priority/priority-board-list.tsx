/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { PriorityIcons } from 'modules/issues/components';

import { Priorities, type IssueType } from 'common/types/issue';

import { BoardColumn, BoardItem } from 'components/ui/board';
import { ScrollArea } from 'components/ui/scroll-area';
import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { BoardIssueItem } from '../../issue-board-item';
import { useFilterIssues } from '../../list-view-utils';

interface PriorityBoardListProps {
  priority: number;
}

export const PriorityBoardList = observer(
  ({ priority }: PriorityBoardListProps) => {
    const { issuesStore, applicationStore } = useContextStore();
    const team = useCurrentTeam();
    const issues = issuesStore.getIssuesForPriority(
      priority,
      team.id,
      applicationStore.displaySettings.showSubIssues,
    );
    const computedIssues = useFilterIssues(issues);

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }

    const PriorityIcon = PriorityIcons[priority];

    return (
      <BoardColumn key={priority} id={`${priority}`}>
        <div className="flex flex-col max-h-[100%]">
          <div className="flex items-center w-full p-4 pb-1">
            <PriorityIcon.icon
              size={18}
              className="text-muted-foreground mr-2"
            />
            <h3 className="pl-2 text-sm font-medium">
              {Priorities[priority]}
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
