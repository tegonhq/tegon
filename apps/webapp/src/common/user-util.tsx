import { RoleEnum } from '@tegonhq/types';
import { AvatarText } from '@tegonhq/ui/components/avatar';

import type { User } from 'common/types';

import { getBotIcon } from './icon-utils';

export function getUserFromUsersData(usersData: User[], userId: string) {
  return usersData.find((userData: User) => userData.id === userId);
}

export function getUserIcon(user: User) {
  if (user && user.role === RoleEnum.BOT && user.image) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = getBotIcon(user.image as any);

    return (
      <Component className="text-[9px] mr-2 h-5 w-5 bg-background-3 rounded-sm p-[2px]" />
    );
  }

  return <AvatarText text={user?.fullname} className="text-[9px] mr-2" />;
}
