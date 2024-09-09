import { RoleEnum } from '@tegonhq/types';
import { AvatarText } from '@tegonhq/ui/components/avatar';
import { getBotIcon } from 'common';
import type { User } from 'common/types';
import type { IssueSourceMetadataType } from 'common/types';

export function getUserDetails(
  sourceMetadata: IssueSourceMetadataType,
  user?: User,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const name = sourceMetadata?.userDisplayName
    ? `${sourceMetadata.userDisplayName} (${user?.fullname})`
    : user?.fullname;

  return {
    fullname: name,
    username: user?.username,
  };
}
