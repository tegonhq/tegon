import type { User } from '@tegonhq/types';

export function getUserData(usersData: User[], userId: string) {
  return usersData.find((userData: User) => userData.id === userId);
}
