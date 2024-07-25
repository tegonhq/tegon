import type { User } from 'store/user-context';

export function getUserData(usersData: User[], userId: string) {
  return usersData.find((userData: User) => userData.id === userId);
}
