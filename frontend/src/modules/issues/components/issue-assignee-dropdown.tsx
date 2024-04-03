/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { getTailwindColor } from 'common/color-utils';
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
import { AssigneeLine } from 'icons';

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
                <AvatarFallback
                  className={cn(
                    'text-[0.6rem] rounded-sm',
                    getTailwindColor(getUserData(value).username),
                  )}
                >
                  {getInitials(getUserData(value).fullname)}
                </AvatarFallback>
              </Avatar>
            </>
          ) : (
            <div className="h-[20px] w-[25px] flex items-center justify-center">
              <AssigneeLine size={18} className="mr-1 text-muted-foreground" />
            </div>
          )}
        </Button>
      );
    }

    if (variant === IssueAssigneeDropdownVariant.LINK) {
      return (
        <Button
          variant="outline"
          role="combobox"
          size="sm"
          aria-expanded={open}
          className={cn(
            'flex items-center border text-foreground dark:bg-transparent border-transparent hover:border-slate-200 dark:border-transparent dark:hover:border-slate-700 px-2 shadow-none justify-between text-sm font-normal focus-visible:ring-1 focus-visible:border-primary',
          )}
        >
          {value ? (
            <>
              <Avatar className="h-[20px] w-[20px] mr-3">
                <AvatarImage />
                <AvatarFallback
                  className={cn(
                    'text-[0.6rem] rounded-sm',
                    getTailwindColor(getUserData(value).username),
                  )}
                >
                  {getInitials(getUserData(value).fullname)}
                </AvatarFallback>
              </Avatar>

              {getUserData(value).fullname}
            </>
          ) : (
            <div className="text-muted-foreground flex">
              <AssigneeLine size={18} className="mr-3" />
              No Assignee
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
              <AvatarFallback
                className={cn(
                  'text-[0.6rem] rounded-sm mr-2',
                  getTailwindColor(getUserData(value).username),
                )}
              >
                {getInitials(getUserData(value).fullname)}
              </AvatarFallback>
            </Avatar>

            {getUserData(value).fullname}
          </>
        ) : (
          <>
            <AssigneeLine size={18} className="mr-2" /> No Assignee
          </>
        )}
      </Button>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
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
