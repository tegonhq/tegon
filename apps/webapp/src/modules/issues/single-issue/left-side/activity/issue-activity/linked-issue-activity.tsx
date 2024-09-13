import { RiLink } from '@remixicon/react';

import { type LinkedIssueType } from 'common/types';
import { getUserIcon } from 'common/user-util';

import { useUserData } from 'hooks/users';

import { getUserDetails } from './user-activity-utils';

interface LinkedIssueActivityProps {
  linkedIssue: LinkedIssueType;
}

export function LinkedIssueActivity({ linkedIssue }: LinkedIssueActivityProps) {
  const { user, isLoading } = useUserData(linkedIssue.createdById);

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
        <> {getUserIcon(user)}</>
      ) : (
        <div className="h-5 w-5 flex items-center justify-center mr-2">
          {getIcon()}
        </div>
      )}

      <div className="flex items-center">
        <span className="text-foreground mr-2">
          {getUserDetails(sourceData, user).fullname}
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
