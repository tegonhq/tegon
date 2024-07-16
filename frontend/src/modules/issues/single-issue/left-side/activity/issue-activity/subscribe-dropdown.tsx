import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { AvatarText } from 'components/ui/avatar';
import { useUsersData } from 'hooks/users';

import type { User } from 'store/user-context';

interface SubscribeDropdownProps {
  value: string[];
  onChange?: (value: string[]) => void;
}

export const SubscribeDropdown = observer(
  ({ value = [] }: SubscribeDropdownProps) => {
    const { usersData, isLoading } = useUsersData();

    if (isLoading) {
      return null;
    }
    const subscribedUserData = usersData
      ? usersData.filter((userData: User) => value.includes(userData.id))
      : [];

    return (
      <>
        {subscribedUserData.map((user: User, index: number) => {
          return (
            <AvatarText
              key={index}
              text={user.fullname}
              className="h-5 w-5 flex items-center rounded-sm text-[9px] border border-gray-200 -ml-2"
            />
          );
        })}
      </>
    );
  },
);
