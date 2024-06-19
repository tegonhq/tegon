/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { BoardIssueItem } from 'modules/issues/components/issue-board-item';

import type { IssueType } from 'common/types/issue';
import type { UsersOnWorkspaceType } from 'common/types/workspace';

import { AvatarText } from 'components/ui/avatar';
import { BoardColumn, BoardItem } from 'components/ui/board';
import { ScrollArea } from 'components/ui/scroll-area';
import { useCurrentTeam } from 'hooks/teams';
import { useUsersData } from 'hooks/users';
import { AssigneeLine } from 'icons';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

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
    const { usersData, isLoading } = useUsersData();
    const computedIssues = useFilterIssues(issues, team.id);

    if (isLoading) {
      return null;
    }

    function getUserData(userId: string) {
      return usersData.find((userData: User) => userData.id === userId);
    }

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }
    return (
      <BoardColumn key={userOnWorkspace.userId} id={userOnWorkspace.userId}>
        <div className="flex flex-col max-h-[100%] pr-4">
          <div className="flex gap-1 items-center mb-2">
            <div className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 bg-grayAlpha-200">
              <AvatarText
                text={getUserData(userOnWorkspace.userId).fullname}
                className="h-5 w-5 text-[9px]"
              />
              <h3 className="pl-2">
                {getUserData(userOnWorkspace.userId).fullname}
              </h3>
            </div>

            <div className="rounded-lg bg-grayAlpha-100 p-1.5 px-2">
              {computedIssues.length}
            </div>
          </div>

          <ScrollArea>
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
          <div className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 bg-grayAlpha-200">
            <AssigneeLine size={20} />
            <h3 className="pl-2">No Assignee</h3>
          </div>

          <div className="rounded-lg bg-grayAlpha-100 p-1.5 px-2">
            {computedIssues.length}
          </div>
        </div>

        <ScrollArea>
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
