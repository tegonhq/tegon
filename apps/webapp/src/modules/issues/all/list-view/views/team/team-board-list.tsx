import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { BoardColumn, BoardItem } from '@tegonhq/ui/components/board';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { BoardIssueItem } from 'modules/issues/components/issue-board-item';

import type { TeamType } from 'common/types';
import type { IssueType } from 'common/types';

import { useProject } from 'hooks/projects';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';

interface TeamBoardListProps {
  team: TeamType;
}

export const TeamBoardList = observer(({ team }: TeamBoardListProps) => {
  const { issuesStore, applicationStore } = useContextStore();
  const project = useProject();
  const { workflows } = useComputedWorkflows();

  const issues = issuesStore.getIssuesForTeam({
    teamId: team.id,
    projectId: project?.id,
  });

  const computedIssues = useFilterIssues(issues, workflows);

  if (
    computedIssues.length === 0 &&
    !applicationStore.displaySettings.showEmptyGroups
  ) {
    return null;
  }
  return (
    <BoardColumn key={team.id} id={team.id}>
      <div className="flex flex-col max-h-[100%]">
        <div className="flex gap-1 items-center mb-2">
          <div className="inline-flex items-center w-fit h-8 rounded-2xl px-4 py-2 gap-1 min-w-[0px] bg-grayAlpha-100">
            <TeamIcon name={team.name} />
            <div className="truncate"> {team.name}</div>
          </div>

          <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
            {computedIssues.length}
          </div>
        </div>

        <ScrollArea className="pr-3 mr-2" id="team-board-list">
          <div className="flex flex-col gap-3 grow pb-10 pt-2">
            {computedIssues.map((issue: IssueType, index: number) => (
              <BoardItem key={issue.id} id={issue.id}>
                <Draggable key={issue.id} draggableId={issue.id} index={index}>
                  {(
                    dragProvided: DraggableProvided,
                    dragSnapshot: DraggableStateSnapshot,
                  ) => {
                    return (
                      <BoardIssueItem
                        issueId={issue.id}
                        isDragging={dragSnapshot.isDragging}
                        provided={dragProvided}
                      />
                    );
                  }}
                </Draggable>
              </BoardItem>
            ))}
          </div>
        </ScrollArea>
      </div>
    </BoardColumn>
  );
});
