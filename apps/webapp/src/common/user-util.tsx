import { RoleEnum } from '@tegonhq/types';
import { AvatarText } from '@tegonhq/ui/components/avatar';

import type { User } from 'common/types';

import { getBotIcon } from './icon-utils';

export function getUserFromUsersData(usersData: User[], userId: string) {
  return usersData.find((userData: User) => userData.id === userId);
}

export function getUserIcon(user: User) {
  if (user.role === RoleEnum.BOT && user.image) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = getBotIcon(user.image as any);

    return <Component className="text-[9px] mr-2 w-5" />;
  }

  return <AvatarText text={user?.fullname} className="text-[9px] mr-2" />;
}
