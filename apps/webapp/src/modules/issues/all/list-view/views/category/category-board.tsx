import type { DropResult } from '@hello-pangea/dnd';

import { Board } from '@tegonhq/ui/components/board';
import { observer } from 'mobx-react-lite';

import type { WorkflowType } from 'common/types';

import { useComputedWorkflows } from 'hooks/workflows';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { CategoryBoardList } from './category-board-list';

interface CategoryBoardProps {
  workflows: WorkflowType[];
}

export const CategoryBoard = observer(({ workflows }: CategoryBoardProps) => {
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const { issuesStore } = useContextStore();
  const { workflowMap } = useComputedWorkflows();

  const onDragEnd = (result: DropResult) => {
    const issueId = result.draggableId;

    const workflowName = result.destination.droppableId;
    const issue = issuesStore.getIssueById(issueId);
    const workflowIds = workflows.find(
      (workflow) => workflow.name === workflowName,
    ).ids;

    const workflowId = workflowIds.find(
      (workflowId) => workflowMap[workflowId].teamId === issue.teamId,
    );

    if (issue.stateId !== workflowId) {
      updateIssue({ id: issueId, stateId: workflowId, teamId: issue.teamId });
    }
  };

  return (
    <Board onDragEnd={onDragEnd} className="pl-6">
      <>
        {workflows.map((workflow: WorkflowType) => {
          return (
            <CategoryBoardList
              key={workflow.name}
              workflow={workflow}
              workflows={workflows}
            />
          );
        })}
      </>
    </Board>
  );
});
