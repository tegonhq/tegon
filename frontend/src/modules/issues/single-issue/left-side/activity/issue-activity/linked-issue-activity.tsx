/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiGithubFill, RiLink } from '@remixicon/react';

import {
  Integration,
  LinkedSlackMessageType,
  type LinkedIssueType,
} from 'common/types/linked-issue';

import { AvatarText } from 'components/ui/avatar';
import { useUsersData } from 'hooks/users';
import { Gmail, SentryIcon, SlackIcon } from 'icons';

import type { User } from 'store/user-context';

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
  const sourceMetaData = JSON.parse(linkedIssue.source);

  function getIcon() {
    if (sourceMetaData) {
      if (sourceMetaData.type === Integration.Slack) {
        return <SlackIcon size={16} />;
      }

      if (sourceMetaData.type === Integration.Github) {
        return <RiGithubFill size={18} />;
      }

      if (sourceMetaData.type === Integration.Sentry) {
        return <SentryIcon size={18} />;
      }

      if (sourceMetaData.type === Integration.Gmail) {
        return <Gmail size={18} />;
      }
    }

    return <RiLink size={18} />;
  }

  function getTitle() {
    if (sourceMetaData) {
      if (sourceMetaData.type === Integration.Slack) {
        return (
          <>
            {getIcon()}
            <span className="mx-[2px]">
              {sourceMetaData.subType === LinkedSlackMessageType.Thread
                ? 'Thread'
                : 'Message'}
            </span>
            from slack
          </>
        );
      }

      if (
        sourceMetaData.type === Integration.Github ||
        sourceMetaData.type === Integration.Gmail ||
        sourceMetaData.type === Integration.Sentry
      ) {
        return (
          <>
            {getIcon()} {sourceData.title}
          </>
        );
      }
    }
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
            getUserDetails(sourceMetaData, getUserData(linkedIssue.createdById))
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
