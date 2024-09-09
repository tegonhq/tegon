import type { User } from 'common/types';
import { getUserIcon } from 'common/user-util';

export function getCreatedBy(user: User) {
  return (
    <div className="flex items-center">
      {getUserIcon(user)}
      {user.username}
    </div>
  );
}
