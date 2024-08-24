import { AvatarText } from '@tegonhq/ui/components/avatar';

import type { User } from 'common/types';

export function getCreatedBy(user: User) {
  return (
    <div className="flex gap-2 text-muted-foreground items-center">
      <AvatarText text={user.fullname} className="text-[9px]" />
      {user.username}
    </div>
  );
}
