/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiGithubFill } from '@remixicon/react';
import type { IssueSourceMetadataType, IssueType } from 'common/types/issue';
import { Integration } from 'common/types/linked-issue';
import { AvatarText } from 'components/ui/avatar';
import { Gmail, SlackIcon } from 'icons';
import type { User } from 'store/user-context';

export function getCreatedBy(issue: IssueType, user: User) {
  const sourceMetadata = issue.sourceMetadata
    ? (JSON.parse(issue.sourceMetadata) as IssueSourceMetadataType)
    : undefined;

  if (sourceMetadata) {
    if (sourceMetadata.type === Integration.Slack) {
      return (
        <div className="flex gap-2 text-muted-foreground items-center">
          <SlackIcon size={14} />
          Slack
        </div>
      );
    }

    if (sourceMetadata.type === Integration.Github) {
      return (
        <div className="flex gap-2 text-muted-foreground items-center">
          <RiGithubFill size={16} />
          Github
        </div>
      );
    }

    if (sourceMetadata.type === Integration.Gmail) {
      return (
        <div className="flex gap-2 text-muted-foreground items-center">
          <Gmail size={16} />
          Gmail
        </div>
      );
    }
  }

  return (
    <div className="flex gap-2 text-muted-foreground items-center">
      <AvatarText text={user.fullname} className="text-[9px]" />
      {user.username}
    </div>
  );
}
