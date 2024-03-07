/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiAccountCircleLine } from '@remixicon/react';
import * as React from 'react';

import { cn } from 'common/lib/utils';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useUsersData } from 'hooks/users/use-users-data';

import type { User } from 'store/user-context';

import { IssueAssigneeDropdownContent } from '../components/issue-assignee-dropdown-content';

interface IssueAssigneeDropdownProps {
  value?: string;
  onChange?: (assigneeId: string) => void;
}

export function IssueAssigneeDropdown({
  value,
  onChange,
}: IssueAssigneeDropdownProps) {
  const [open, setOpen] = React.useState(false);

  const { usersData } = useUsersData();

  function getUserData(userId: string) {
    return usersData.find((userData: User) => userData.id === userId);
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="xs"
            aria-expanded={open}
            className={cn(
              'flex items-center justify-between text-xs font-normal focus-visible:ring-1 focus-visible:border-primary text-muted-foreground',
              value && 'text-foreground',
            )}
          >
            {value ? (
              <>
                <Avatar className="h-[20px] w-[25px]">
                  <AvatarImage />
                  <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-[0.6rem] rounded-sm mr-2">
                    {getInitials(getUserData(value).fullname)}
                  </AvatarFallback>
                </Avatar>

                {getUserData(value).fullname}
              </>
            ) : (
              <>
                <RiAccountCircleLine size={14} className="mr-1" /> Assignee
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <IssueAssigneeDropdownContent
            onClose={() => setOpen(false)}
            usersData={usersData}
            onChange={onChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
