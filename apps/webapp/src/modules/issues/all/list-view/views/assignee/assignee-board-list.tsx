import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { AvatarText } from '@tegonhq/ui/components/avatar';
import { BoardColumn, BoardItem } from '@tegonhq/ui/components/board';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { AssigneeLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { BoardIssueItem } from 'modules/issues/components/issue-board-item';

import type { UsersOnWorkspaceType } from 'common/types';
import type { IssueType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';
import { useUserData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';

interface AssigneeBoardListProps {
  userOnWorkspace: UsersOnWorkspaceType;
}

export const AssigneeBoardList = observer(
  ({ userOnWorkspace }: AssigneeBoardListProps) => {
    const { issuesStore, applicationStore } = useContextStore();
    const team = useCurrentTeam();
    const issues = issuesStore.getIssuesForUser(
      applicationStore.displaySettings.showSubIssues,
      { userId: userOnWorkspace.userId, teamId: team.id },
    );
    const { user, isLoading } = useUserData(userOnWorkspace.userId);
    const computedIssues = useFilterIssues(issues, team.id);

    if (isLoading) {
      return null;
    }

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }
    return (
      <BoardColumn key={userOnWorkspace.userId} id={userOnWorkspace.userId}>
        <div className="flex flex-col max-h-[100%]">
          <div className="flex gap-1 items-center mb-2">
            <div className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 bg-grayAlpha-100">
              <AvatarText text={user.fullname} className="h-5 w-5 text-[9px]" />
              <h3 className="pl-2">{user.fullname}</h3>
            </div>

            <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
              {computedIssues.length}
            </div>
          </div>

          <ScrollArea className="pr-3 mr-2">
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

export const NoAssigneeView = observer(() => {
  const { issuesStore, applicationStore } = useContextStore();
  const team = useCurrentTeam();
  const issues = issuesStore.getIssuesForUser(
    applicationStore.displaySettings.showSubIssues,
    { userId: undefined, teamId: team.id },
  );
  const computedIssues = useFilterIssues(issues, team.id);

  if (computedIssues.length === 0) {
    return null;
  }

  return (
    <BoardColumn key="no-user" id="no-user">
      <div className="flex flex-col max-h-[100%]">
        <div className="flex gap-1 items-center mb-2">
          <div className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 bg-grayAlpha-100">
            <AssigneeLine size={20} />
            <h3 className="pl-2">No Assignee</h3>
          </div>

          <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
            {computedIssues.length}
          </div>
        </div>

        <ScrollArea className="pr-3 mr-2">
          <div className="flex flex-col gap-3 grow pb-10 pt-2">
            {computedIssues.map((issue: IssueType, index: number) => (
              <BoardItem key={issue.id} id={issue.id}>
                <Draggable key={issue.id} draggableId={issue.id} index={index}>
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
});
