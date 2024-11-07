import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { BadgeColor } from '@tegonhq/ui/components/badge';
import { BoardColumn, BoardItem } from '@tegonhq/ui/components/board';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { LabelType } from 'common/types';
import type { IssueType } from 'common/types';

import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { BoardIssueItem } from '../../../../components/issue-board-item/issue-board-item';
import { useFilterIssues } from '../../../../issues-utils';

interface LabelBoardItemProps {
  label: LabelType;
}

export const LabelBoardList = observer(({ label }: LabelBoardItemProps) => {
  const { issuesStore, applicationStore } = useContextStore();
  const project = useProject();
  const { workflows } = useComputedWorkflows();
  const team = useCurrentTeam();

  const issues = issuesStore.getIssuesForLabel(label.ids, {
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

  return (
    <BoardColumn key={label.id} id={label.id}>
      <div className="flex flex-col max-h-[100%]">
        <div className="flex gap-1 items-center mb-2">
          <div className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 bg-grayAlpha-100">
            <BadgeColor style={{ backgroundColor: label.color }} />
            <h3 className="pl-2">{label.name}</h3>
          </div>

          <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
            {computedIssues.length}
          </div>
        </div>

        <ScrollArea className="pr-3 mr-2">
          <div className="flex flex-col gap-3 grow pb-10 pt-2">
            {computedIssues.map((issue: IssueType, index: number) => {
              const id = `${label.name}__${issue.id}`;

              return (
                <BoardItem key={id} id={id}>
                  <Draggable key={id} draggableId={id} index={index}>
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
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </BoardColumn>
  );
});

export const NoLabelBoardList = observer(() => {
  const { issuesStore, applicationStore } = useContextStore();
  const team = useCurrentTeam();
  const { workflows } = useComputedWorkflows();
  const project = useProject();

  const issues = issuesStore.getIssuesForNoLabel({
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

  return (
    <BoardColumn key="no-label" id="no-label">
      <div className="flex flex-col max-h-[100%]">
        <div className="flex gap-1 items-center mb-2">
          <div className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 bg-grayAlpha-100">
            <BadgeColor style={{ backgroundColor: '#838383' }} />
            <h3 className="pl-2">No Label</h3>
          </div>

          <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
            {computedIssues.length}
          </div>
        </div>

        <ScrollArea className="pr-3 mr-2">
          <div className="flex flex-col gap-3 grow pb-10 pt-2">
            {computedIssues.map((issue: IssueType, index: number) => {
              return (
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
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </BoardColumn>
  );
});
