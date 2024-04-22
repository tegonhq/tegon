/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { RiAccountCircleFill } from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { getTailwindColor } from 'common/color-utils';
import { cn } from 'common/lib/utils';
import type { IssueType } from 'common/types/issue';
import type { UsersOnWorkspaceType } from 'common/types/workspace';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { BoardColumn, BoardItem } from 'components/ui/board';
import { ScrollArea } from 'components/ui/scroll-area';
import { useCurrentTeam } from 'hooks/teams';
import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

import { BoardIssueItem } from '../../issue-board-item';
import { useFilterIssues } from '../../list-view-utils';

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
    const computedIssues = useFilterIssues(issues);

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
        <div className="flex flex-col max-h-[100%]">
          <div className="flex items-center w-full px-4">
            <Avatar className="h-[15px] w-[20px] flex items-center">
              <AvatarImage />
              <AvatarFallback
                className={cn(
                  'text-[0.55rem] rounded-sm mr-1',
                  getTailwindColor(
                    getUserData(userOnWorkspace.userId).username,
                  ),
                )}
              >
                {getInitials(getUserData(userOnWorkspace.userId).fullname)}
              </AvatarFallback>
            </Avatar>
            <h3 className="pl-2 text-sm font-medium">
              {getUserData(userOnWorkspace.userId).fullname}
              <span className="text-muted-foreground ml-2">
                {computedIssues.length}
              </span>
            </h3>
          </div>

          <ScrollArea className="p-3 pb-10">
            <div className="flex flex-col gap-3 grow">
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
  const computedIssues = useFilterIssues(issues);

  if (computedIssues.length === 0) {
    return null;
  }

  return (
    <BoardColumn key="no-user" id="no-user">
      <div className="flex flex-col max-h-[100%]">
        <div className="flex items-center w-full p-4 pb-1">
          <RiAccountCircleFill
            size={18}
            className="text-muted-foreground mr-1"
          />

          <h3 className="pl-2 text-sm font-medium">
            No Assignee
            <span className="text-muted-foreground ml-2">
              {computedIssues.length}
            </span>
          </h3>
        </div>

        <ScrollArea className="p-3 pb-10">
          <div className="flex flex-col gap-3 grow">
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
