import { RiLink } from '@remixicon/react';
import { AvatarText } from '@tegonhq/ui/components/avatar';

import { type LinkedIssueType } from 'common/types';
import type { User } from 'common/types';

import { useUsersData } from 'hooks/users';

import { getUserDetails } from './user-activity-utils';

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

  function getIcon() {
    return <RiLink size={18} />;
  }

  function getTitle() {
    return <>{sourceData?.title}</>;
  }

  return (
    <div className="flex items-center">
      {linkedIssue.createdById ? (
        <AvatarText
          text={getUserData(linkedIssue.createdById).fullname}
          className="h-5 w-5 text-[9px] mr-4"
        />
      ) : (
        <div className="h-5 w-5 flex items-center justify-center mr-4">
          {getIcon()}
        </div>
      )}

      <div className="flex items-center">
        <span className="text-foreground mr-2 font-medium">
          {
            getUserDetails(sourceData, getUserData(linkedIssue.createdById))
              .username
          }
        </span>
        <span className="text-muted-foreground">linked</span>
        <a
          href={linkedIssue.url}
          target="_blank"
          className="flex items-center gap-1 ml-2 mr-1"
        >
          {getTitle()}
        </a>
      </div>
    </div>
  );
}
