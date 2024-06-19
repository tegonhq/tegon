/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { IssueType } from 'common/types/issue';
import type { LabelType } from 'common/types/label';

import { BadgeColor } from 'components/ui/badge';
import { BoardColumn, BoardItem } from 'components/ui/board';
import { ScrollArea } from 'components/ui/scroll-area';
import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { BoardIssueItem } from '../../../../components/issue-board-item/issue-board-item';
import { useFilterIssues } from '../../../../issues-utils';

interface LabelBoardItemProps {
  label: LabelType;
}

export const LabelBoardList = observer(({ label }: LabelBoardItemProps) => {
  const { issuesStore, applicationStore } = useContextStore();
  const issues = issuesStore.getIssuesForLabel(
    label.id,
    applicationStore.displaySettings.showSubIssues,
  );
  const team = useCurrentTeam();
  const computedIssues = useFilterIssues(issues, team.id);

  if (
    computedIssues.length === 0 &&
    !applicationStore.displaySettings.showEmptyGroups
  ) {
    return null;
  }

  return (
    <BoardColumn key={label.id} id={label.id}>
      <div className="flex flex-col max-h-[100%] pr-4">
        <div className="flex gap-1 items-center mb-2">
          <div className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 bg-grayAlpha-200">
            <BadgeColor style={{ backgroundColor: label.color }} />
            <h3 className="pl-2">{label.name}</h3>
          </div>

          <div className="rounded-lg bg-grayAlpha-100 p-1.5 px-2">
            {computedIssues.length}
          </div>
        </div>

        <ScrollArea>
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
  const issues = issuesStore.getIssuesForNoLabel(
    applicationStore.displaySettings.showSubIssues,
    team.id,
  );
  const computedIssues = useFilterIssues(issues, team.id);

  if (
    computedIssues.length === 0 &&
    !applicationStore.displaySettings.showEmptyGroups
  ) {
    return null;
  }

  return (
    <BoardColumn key="no-label" id="no-label">
      <div className="flex flex-col max-h-[100%] pr-4">
        <div className="flex gap-1 items-center mb-2">
          <div className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 bg-grayAlpha-200">
            <BadgeColor style={{ backgroundColor: '#838383' }} />
            <h3 className="pl-2">No Label</h3>
          </div>

          <div className="rounded-lg bg-grayAlpha-100 p-1.5 px-2">
            {computedIssues.length}
          </div>
        </div>

        <ScrollArea>
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
