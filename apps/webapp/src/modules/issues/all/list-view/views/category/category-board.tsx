import type { DropResult } from '@hello-pangea/dnd';

import { Board } from '@tegonhq/ui/components/board';
import { observer } from 'mobx-react-lite';

import type { WorkflowType } from 'common/types';

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
    <Board onDragEnd={onDragEnd} className="pl-6">
      <>
        {workflows.map((workflow: WorkflowType) => {
          return <CategoryBoardList key={workflow.id} workflow={workflow} />;
        })}
      </>
    </Board>
  );
});
