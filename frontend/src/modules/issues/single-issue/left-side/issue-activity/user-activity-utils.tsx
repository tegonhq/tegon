/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { RiGithubFill } from '@remixicon/react';

import { getTailwindColor } from 'common/color-utils';
import { cn } from 'common/lib/utils';
import type { IssueSourceMetadataType } from 'common/types/issue';
import { Integration } from 'common/types/linked-issue';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { SlackIcon } from 'icons';

import type { User } from 'store/user-context';

export function getUserDetails(
  sourceMetadata: IssueSourceMetadataType,
  user?: User,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (user) {
    return user;
  }

  const name = sourceMetadata?.userDisplayName ?? sourceMetadata.type;

  return {
    fullname: name,
    username: name,
  };
}

export function getUserIcon(
  user: { username: string; fullname: string },
  type?: Integration,
) {
  if (type === Integration.Slack) {
    return (
      <div className="h-[15px] w-[20px] mr-4 flex items-center justify-center">
        <SlackIcon size={16} />
      </div>
    );
  }

  if (type === Integration.Github) {
    return (
      <div className="h-[15px] w-[20px] mr-4 flex items-center justify-center">
        <RiGithubFill size={18} className="text-foreground" />
      </div>
    );
  }

  return (
    <Avatar className="h-[15px] w-[20px] mr-4 text-foreground">
      <AvatarImage />
      <AvatarFallback
        className={cn(
          'text-[0.55rem] rounded-sm',
          getTailwindColor(user.username),
        )}
      >
        {getInitials(user.fullname)}
      </AvatarFallback>
    </Avatar>
  );
}
