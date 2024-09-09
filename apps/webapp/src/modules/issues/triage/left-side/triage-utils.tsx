import type { User } from 'common/types';
import { getUserIcon } from 'common/user-util';

export function getCreatedBy(user: User) {
  return (
    <div className="flex gap-2 text-muted-foreground items-center">
      {getUserIcon(user)}
      {user.username}
    </div>
  );
}
