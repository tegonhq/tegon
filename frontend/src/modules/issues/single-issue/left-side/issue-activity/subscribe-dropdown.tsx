/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { getTailwindColor } from 'common/color-utils';
import { cn } from 'common/lib/utils';

import { Avatar, AvatarImage, AvatarFallback } from 'components/ui/avatar';
import { getInitials } from 'components/ui/avatar';
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
            <Avatar
              className={cn(
                'h-[20px] w-[25px] flex items-center border rounded-full',
                index > 0 && '-ml-2',
              )}
              key={user.id}
            >
              <AvatarImage />
              <AvatarFallback
                className={cn(
                  'text-[0.6rem] rounded-full',
                  getTailwindColor(user.username),
                )}
              >
                {getInitials(user.fullname)}
              </AvatarFallback>
            </Avatar>
          );
        })}
      </>
    );
  },
);
