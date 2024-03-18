/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiAccountCircleFill } from '@remixicon/react';
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

export enum IssueAssigneeDropdownVariant {
  NO_BACKGROUND = 'NO_BACKGROUND',
  DEFAULT = 'DEFAULT',
  LINK = 'LINK',
}

interface IssueAssigneeDropdownProps {
  value?: string;
  onChange?: (assigneeId: string) => void;
  variant?: IssueAssigneeDropdownVariant;
}

export function IssueAssigneeDropdown({
  value,
  onChange,
  variant = IssueAssigneeDropdownVariant.DEFAULT,
}: IssueAssigneeDropdownProps) {
  const [open, setOpen] = React.useState(false);

  const { usersData, isLoading } = useUsersData();

  function getUserData(userId: string) {
    return usersData.find((userData: User) => userData.id === userId);
  }

  if (isLoading || !usersData) {
    return null;
  }

  function getTrigger() {
    if (variant === IssueAssigneeDropdownVariant.NO_BACKGROUND) {
      return (
        <Button
          variant="outline"
          role="combobox"
          size="xs"
          aria-expanded={open}
          className={cn(
            'flex items-center justify-between text-foreground !bg-transparent hover:bg-transparent shadow-none p-0 border-0 text-xs font-normal focus-visible:ring-1 focus-visible:border-primary',
          )}
        >
          {value ? (
            <>
              <Avatar className="h-[20px] w-[25px] flex items-center">
                <AvatarImage />
                <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-[0.7rem] rounded-sm">
                  {getInitials(getUserData(value).fullname)}
                </AvatarFallback>
              </Avatar>
            </>
          ) : (
            <>
              <RiAccountCircleFill
                size={18}
                className="mr-1 text-muted-foreground"
              />
            </>
          )}
        </Button>
      );
    }

    if (variant === IssueAssigneeDropdownVariant.LINK) {
      return (
        <Button
          variant="outline"
          role="combobox"
          size="lg"
          aria-expanded={open}
          className={cn(
            'flex items-center border text-foreground dark:bg-transparent border-transparent hover:border-gray-200 dark:border-transparent dark:hover:border-gray-700 px-3 shadow-none justify-between text-sm font-normal focus-visible:ring-1 focus-visible:border-primary',
          )}
        >
          {value ? (
            <>
              <Avatar className="h-[20px] w-[30px]">
                <AvatarImage />
                <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-[0.6rem] rounded-sm mr-2">
                  {getInitials(getUserData(value).fullname)}
                </AvatarFallback>
              </Avatar>

              {getUserData(value).fullname}
            </>
          ) : (
            <div className="flex text-muted-foreground items-center">
              <RiAccountCircleFill size={18} className="mr-2" /> No Assignee
            </div>
          )}
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        role="combobox"
        size="xs"
        aria-expanded={open}
        className={cn(
          'flex items-center justify-between text-xs font-normal focus-visible:ring-1 focus-visible:border-primary text-foreground',
        )}
      >
        {value ? (
          <>
            <Avatar className="h-[20px] w-[30px] flex items-center">
              <AvatarImage />
              <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-[0.6rem] rounded-sm mr-2">
                {getInitials(getUserData(value).fullname)}
              </AvatarFallback>
            </Avatar>

            {getUserData(value).fullname}
          </>
        ) : (
          <>
            <RiAccountCircleFill size={18} className="mr-1" /> No Assignee
          </>
        )}
      </Button>
    );
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{getTrigger()}</PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <IssueAssigneeDropdownContent
            onClose={() => setOpen(false)}
            usersData={usersData}
            onChange={onChange}
            value={value}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
