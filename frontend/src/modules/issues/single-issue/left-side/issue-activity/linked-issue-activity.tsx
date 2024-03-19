/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiGithubFill } from '@remixicon/react';
import ReactTimeAgo from 'react-time-ago';

import type { LinkedIssueType } from 'common/types/linked-issue';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { useUsersData } from 'hooks/users';

import type { User } from 'store/user-context';

interface LinkedIssueActivityProps {
  linkedIssue: LinkedIssueType;
}

export function LinkedIssueActivity({ linkedIssue }: LinkedIssueActivityProps) {
  const { usersData, isLoading } = useUsersData();

  function getUserData(userId: string) {
    return usersData.find((userData: User) => userData.id === userId);
  }

  if (isLoading) {
    return null;
  }

  const sourceData = JSON.parse(linkedIssue.sourceData);

  return (
    <div className="flex items-center text-xs text-muted-foreground">
      {linkedIssue.createdById ? (
        <Avatar className="h-[20px] w-[25px] mr-4 text-foreground">
          <AvatarImage />
          <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-[0.6rem] rounded-sm">
            {getInitials(getUserData(linkedIssue.createdById).fullname)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="h-[20px] w-[25px] flex items-center justify-center mr-4">
          <RiGithubFill size={18} className="text-foreground" />
        </div>
      )}

      <div className="flex items-center">
        <span className="text-foreground mr-2 font-medium">
          {linkedIssue.createdById
            ? `${getUserData(linkedIssue.createdById).username}`
            : 'Github'}
        </span>
        linked
        <a
          href={linkedIssue.url}
          target="_blank"
          className="flex items-center gap-1 ml-2 mr-1 text-foreground"
        >
          <RiGithubFill size={16} /> {sourceData.title}
        </a>
      </div>
      <div className="mx-1">-</div>

      <div>
        <ReactTimeAgo date={new Date(linkedIssue.updatedAt)} />
      </div>
    </div>
  );
}
