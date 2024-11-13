import type { DropResult } from '@hello-pangea/dnd';

import { Board } from '@tegonhq/ui/components/board';
import { observer } from 'mobx-react-lite';

import type { User } from 'common/types';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { AssigneeBoardList, NoAssigneeView } from './assignee-board-list';

interface AssigneeBoardProps {
  users: User[];
}

export const AssigneeBoard = observer(({ users }: AssigneeBoardProps) => {
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const { issuesStore } = useContextStore();

  const onDragEnd = (result: DropResult) => {
    const issueId = result.draggableId;

    const assigneeId = result.destination.droppableId;
    const issue = issuesStore.getIssueById(issueId);

    if (assigneeId !== issue.assigneeId) {
      updateIssue({ id: issueId, assigneeId, teamId: issue.teamId });
    }
  };

  return (
    <Board onDragEnd={onDragEnd} className="pl-4">
      <>
        {users.map((user: User) => {
          return <AssigneeBoardList key={user.id} user={user} />;
        })}

        <NoAssigneeView />
      </>
    </Board>
  );
});
