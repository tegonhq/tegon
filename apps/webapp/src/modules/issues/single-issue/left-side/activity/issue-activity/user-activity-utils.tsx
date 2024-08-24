import type { User } from 'common/types';
import type { IssueSourceMetadataType } from 'common/types';

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
