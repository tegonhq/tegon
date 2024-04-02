/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiAccountCircleFill } from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { IssueType } from 'common/types/issue';
import type { UsersOnWorkspaceType } from 'common/types/workspace';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

import { IssueItem } from '../../issue-item';
import { filterIssues } from '../../list-view-utils';

interface AssigneeViewItemProps {
  userOnWorkspace: UsersOnWorkspaceType;
}

export const AssigneeViewItem = observer(
  ({ userOnWorkspace }: AssigneeViewItemProps) => {
    const { issuesStore, applicationStore } = useContextStore();
    const issues = issuesStore.getIssuesForUser(
      applicationStore.displaySettings.showSubIssues,
      userOnWorkspace.userId,
    );
    const { usersData, isLoading } = useUsersData();
    const computedIssues = React.useMemo(() => {
      return filterIssues(issues, applicationStore.filters);
    }, [issues, applicationStore.filters]);

    if (isLoading) {
      return null;
    }

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }

    function getUserData(userId: string) {
      return usersData.find((userData: User) => userData.id === userId);
    }

    return (
      <div className="flex flex-col">
        <div className="flex items-center w-full pl-8 p-2 bg-active dark:bg-slate-800/60">
          <Avatar className="h-[20px] w-[25px] flex items-center">
            <AvatarImage />
            <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-[0.6rem] rounded-sm mr-1">
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

        <div>
          {computedIssues.map((issue: IssueType) => (
            <IssueItem key={issue.id} issueId={issue.id} />
          ))}
        </div>
      </div>
    );
  },
);

export const NoAssigneeView = observer(() => {
  const { issuesStore, applicationStore } = useContextStore();
  const issues = issuesStore.getIssuesForUser(
    applicationStore.displaySettings.showSubIssues,
    undefined,
  );

  if (issues.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center w-full pl-8 p-2 bg-active dark:bg-slate-800/60">
        <RiAccountCircleFill size={18} className="text-muted-foreground mr-1" />

        <h3 className="pl-2 text-sm font-medium">
          No Assignee
          <span className="text-muted-foreground ml-2">{issues.length}</span>
        </h3>
      </div>

      <div>
        {issues.map((issue: IssueType) => (
          <IssueItem key={issue.id} issueId={issue.id} />
        ))}
      </div>
    </div>
  );
});
