import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { BoardColumn, BoardItem } from '@tegonhq/ui/components/board';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { PriorityIcons } from 'modules/issues/components';
import { BoardIssueItem } from 'modules/issues/components/issue-board-item';

import { type IssueType } from 'common/types';

import { usePriorities } from 'hooks/priorities';
import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';

interface PriorityBoardListProps {
  priority: number;
}

export const PriorityBoardList = observer(
  ({ priority }: PriorityBoardListProps) => {
    const { issuesStore, applicationStore } = useContextStore();
    const team = useCurrentTeam();
    const { workflows } = useComputedWorkflows();
    const project = useProject();
    const Priorities = usePriorities();

    const issues = issuesStore.getIssuesForPriority(priority, {
      teamId: team?.id,
      projectId: project?.id,
    });
    const computedIssues = useFilterIssues(issues, workflows);

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
          <div className="flex gap-1 items-center mb-2">
            <div className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 bg-grayAlpha-100">
              <PriorityIcon.icon size={20} />
              <h3 className="pl-2">{Priorities[priority]}</h3>
            </div>

            <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
              {computedIssues.length}
            </div>
          </div>

          <ScrollArea className="pr-3 mr-2" id="priority-board-list">
            <div className="flex flex-col gap-3 grow pb-10 pt-2">
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
