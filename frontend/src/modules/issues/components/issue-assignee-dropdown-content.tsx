/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { getTailwindColor } from 'common/color-utils';
import { cn } from 'common/lib/utils';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { Checkbox } from 'components/ui/checkbox';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';
import { AssigneeLine } from 'icons';

import type { User } from 'store/user-context';

interface IssueAssigneeDropdownContentProps {
  onChange?: (assigneeId: string | string[]) => void;
  usersData: User[];
  onClose: () => void;
  multiple?: boolean;
  value: string | string[];
}

export function IssueAssigneeDropdownContent({
  onChange,
  usersData,
  onClose,
  multiple = false,
  value,
}: IssueAssigneeDropdownContentProps) {
  function getUserData(userId: string) {
    return usersData.find((userData: User) => userData.id === userId);
  }

  const onValueChange = (checked: boolean, id: string) => {
    if (checked && !value.includes(id)) {
      onChange && onChange([...value, id]);
    }

    if (!checked && value.includes(id)) {
      const newIds = [...value];
      const indexToDelete = newIds.indexOf(id);

      newIds.splice(indexToDelete, 1);
      onChange && onChange(newIds);
    }
  };

  return (
    <Command className="w-72">
      <CommandInput placeholder="Set assignee..." />
      <CommandGroup>
        <CommandItem
          key="no-user"
          value="no-user"
          className="w-full"
          onSelect={() => {
            onChange && onChange(null);
            onClose();
          }}
        >
          <div className="flex gap-2 items-center">
            {multiple && (
              <Checkbox
                id="no-user"
                checked={value.includes('no-user')}
                onCheckedChange={(value: boolean) =>
                  onValueChange(value, 'no-user')
                }
              />
            )}
            <div className="h-[20px] w-[30px] flex items-center justify-center">
              <AssigneeLine size={16} className="text-muted-foreground mr-2" />
            </div>
            No Assignee
          </div>
        </CommandItem>
        {usersData &&
          usersData.map((user: User) => {
            const userData = getUserData(user.id);

            return (
              <CommandItem
                key={user.id}
                value={user.id}
                onSelect={(currentValue) => {
                  if (!multiple) {
                    onChange && onChange(currentValue);
                    onClose();
                  }
                }}
              >
                <div className="flex gap-2 items-center">
                  {multiple && (
                    <Checkbox
                      id={userData.fullname}
                      checked={value.includes(user.id)}
                      onCheckedChange={(value: boolean) => {
                        onValueChange(value, user.id);
                      }}
                    />
                  )}
                  <Avatar className="h-[20px] w-[30px]">
                    <AvatarImage />
                    <AvatarFallback
                      className={cn(
                        'text-[0.6rem] rounded-sm mr-2',
                        getTailwindColor(userData.username),
                      )}
                    >
                      {getInitials(userData.fullname)}
                    </AvatarFallback>
                  </Avatar>

                  {userData.fullname}
                </div>
              </CommandItem>
            );
          })}
      </CommandGroup>
    </Command>
  );
}
