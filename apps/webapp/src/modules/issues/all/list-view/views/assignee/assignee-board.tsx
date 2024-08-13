import type { DropResult } from '@hello-pangea/dnd';
import type { UsersOnWorkspaceType } from 'common/types';

import { useUpdateIssueMutation } from '@tegonhq/services/issues';
import { Board } from '@tegonhq/ui/components/board';
import { observer } from 'mobx-react-lite';

import { useContextStore } from 'store/global-context-provider';

import { AssigneeBoardList, NoAssigneeView } from './assignee-board-list';

interface AssigneeBoardProps {
  usersOnWorkspaces: UsersOnWorkspaceType[];
}

export const AssigneeBoard = observer(
  ({ usersOnWorkspaces }: AssigneeBoardProps) => {
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
      <Board onDragEnd={onDragEnd} className="pl-6">
        <>
          {usersOnWorkspaces.map((uOW: UsersOnWorkspaceType) => {
            return <AssigneeBoardList key={uOW.id} userOnWorkspace={uOW} />;
          })}

          <NoAssigneeView />
        </>
      </Board>
    );
  },
);
