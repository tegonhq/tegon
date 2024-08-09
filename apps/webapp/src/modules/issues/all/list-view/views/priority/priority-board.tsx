import type { DropResult } from '@hello-pangea/dnd';

import { useUpdateIssueMutation } from 'services/issues';
import { Priorities } from 'common/types';
import { Board } from '@tegonhq/ui/components/board';
import { observer } from 'mobx-react-lite';

import { useContextStore } from 'store/global-context-provider';

import { PriorityBoardList } from './priority-board-list';

export const PriorityBoard = observer(() => {
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const { issuesStore } = useContextStore();

  const onDragEnd = (result: DropResult) => {
    const issueId = result.draggableId;

    const priority = result.destination.droppableId;
    const issue = issuesStore.getIssueById(issueId);

    if (issue.priority !== priority) {
      updateIssue({
        id: issueId,
        priority: parseInt(priority),
        teamId: issue.teamId,
      });
    }
  };

  return (
    <Board onDragEnd={onDragEnd} className="pl-6">
      <>
        {Priorities.map((priority: string) => {
          return (
            <PriorityBoardList
              key={priority}
              priority={Priorities.indexOf(priority)}
            />
          );
        })}
      </>
    </Board>
  );
});
