/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { cn } from 'common/lib/utils';

import { AvatarText } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import { Command, CommandInput } from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useUsersData } from 'hooks/users/use-users-data';
import { AssigneeLine } from 'icons';

import type { User } from 'store/user-context';

import { IssueAssigneeDropdownContent } from './issue-assignee-dropdown-content';

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
          aria-expanded={open}
          className={cn(
            'h-5 w-5 flex items-center justify-between !bg-transparent shadow-none p-0 border-0 focus-visible:ring-1 focus-visible:border-primary',
          )}
        >
          {value ? (
            <>
              <AvatarText
                text={getUserData(value).fullname}
                className="text-[9px]"
              />
            </>
          ) : (
            <div className="flex items-center justify-center">
              <AssigneeLine size={20} className="mr-1 text-muted-foreground" />
            </div>
          )}
        </Button>
      );
    }

    if (variant === IssueAssigneeDropdownVariant.LINK) {
      return (
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex items-center bg-transparent px-0 shadow-none justify-between focus-visible:ring-1 focus-visible:border-primary',
          )}
        >
          {value ? (
            <>
              <AvatarText
                text={getUserData(value).fullname}
                className="h-5 w-5 text-[9px] mr-2"
              />
              {getUserData(value).fullname}
            </>
          ) : (
            <div className="text-muted-foreground flex">
              <AssigneeLine size={20} className="mr-2" />
              No Assignee
            </div>
          )}
        </Button>
      );
    }

    return (
      <Button
        variant="secondary"
        role="combobox"
        aria-expanded={open}
        className={cn(
          'flex items-center justify-between text-xs focus-visible:ring-1 focus-visible:border-primary gap-1',
        )}
      >
        {value ? (
          <>
            <AvatarText
              text={getUserData(value).fullname}
              className="w-5 h-5 text-[9px]"
            />

            {getUserData(value).fullname}
          </>
        ) : (
          <>
            <AssigneeLine size={20} className="mr-1" /> No Assignee
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
        <PopoverContent className="p-0" align="end">
          <Command>
            <CommandInput placeholder="Set assignee..." autoFocus />
            <IssueAssigneeDropdownContent
              onClose={() => setOpen(false)}
              usersData={usersData}
              onChange={onChange}
              value={value}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
