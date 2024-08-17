import { RiGithubFill } from '@remixicon/react';
import { AvatarText } from '@tegonhq/ui/components/avatar';
import { SlackIcon } from '@tegonhq/ui/icons';

import type { User } from 'common/types';
import type { IssueSourceMetadataType } from 'common/types';
import { Integration } from 'common/types';

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

  return <AvatarText text={user.fullname} className="mr-4 text-[9px]" />;
}
