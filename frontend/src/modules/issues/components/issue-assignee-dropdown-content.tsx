/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiAccountCircleLine } from '@remixicon/react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';

import type { User } from 'store/user-context';

interface IssueAssigneeDropdownContentProps {
  onChange?: (assigneeId: string) => void;
  usersData: User[];
  onClose: () => void;
}

export function IssueAssigneeDropdownContent({
  onChange,
  usersData,
  onClose,
}: IssueAssigneeDropdownContentProps) {
  function getUserData(userId: string) {
    return usersData.find((userData: User) => userData.id === userId);
  }

  return (
    <Command>
      <CommandInput placeholder="Set assignee..." />
      <CommandGroup>
        <CommandItem
          key="no-user"
          value="no-user"
          onSelect={() => {
            onChange && onChange(undefined);
            onClose();
          }}
        >
          <RiAccountCircleLine size={14} className="min-w-[25px] mr-1" /> No
          Assignee
        </CommandItem>
        {usersData &&
          usersData.map((user: User) => {
            const userData = getUserData(user.id);

            return (
              <CommandItem
                key={user.id}
                value={user.id}
                onSelect={(currentValue) => {
                  onChange && onChange(currentValue);
                  onClose();
                }}
              >
                <Avatar className="h-[20px] w-[25px]">
                  <AvatarImage />
                  <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-[0.6rem] rounded-sm mr-2">
                    {getInitials(userData.fullname)}
                  </AvatarFallback>
                </Avatar>

                {userData.fullname}
              </CommandItem>
            );
          })}
      </CommandGroup>
    </Command>
  );
}
