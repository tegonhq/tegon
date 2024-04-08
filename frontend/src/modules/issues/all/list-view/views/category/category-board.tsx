/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { DropResult } from '@hello-pangea/dnd';

import { observer } from 'mobx-react-lite';

import type { WorkflowType } from 'common/types/team';

import { Board, BoardColumn } from 'components/ui/board';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { CategoryBoardList } from './category-board-list';

interface CategoryBoardProps {
  workflows: WorkflowType[];
}

export const CategoryBoard = observer(({ workflows }: CategoryBoardProps) => {
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const { issuesStore } = useContextStore();

  const onDragEnd = (result: DropResult) => {
    const issueId = result.draggableId;

    const stateId = result.destination.droppableId;
    const issue = issuesStore.getIssueById(issueId);

    if (issue.stateId !== stateId) {
      updateIssue({ id: issueId, stateId, teamId: issue.teamId });
    }
  };

  return (
    <Board onDragEnd={onDragEnd}>
      <>
        {workflows.map((workflow: WorkflowType) => {
          return (
            <BoardColumn key={workflow.id} id={workflow.id}>
              <CategoryBoardList workflow={workflow} />
            </BoardColumn>
          );
        })}
      </>
    </Board>
  );
});
