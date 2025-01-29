import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { AssigneeLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';

import { UserAvatar } from 'common/user-avatar';
import { getUserFromUsersData } from 'common/user-util';

import { useUsersData } from 'hooks/users/use-users-data';

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
  teamId: string;
}

export function IssueAssigneeDropdown({
  value,
  onChange,
  variant = IssueAssigneeDropdownVariant.DEFAULT,
  teamId,
}: IssueAssigneeDropdownProps) {
  const [open, setOpen] = React.useState(false);

  const { users, isLoading } = useUsersData(false, teamId);

  if (isLoading) {
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
            <UserAvatar user={getUserFromUsersData(users, value)} />
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
          variant="link"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex items-center bg-transparent px-0 shadow-none justify-between focus-visible:ring-1 focus-visible:border-primary',
          )}
        >
          {value ? (
            <>
              <AvatarText
                text={getUserFromUsersData(users, value)?.fullname}
                className="h-5 w-5 text-[9px] mr-2"
              />
              {getUserFromUsersData(users, value)?.fullname}
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
        variant="link"
        role="combobox"
        aria-expanded={open}
        className={cn(
          'flex items-center justify-between focus-visible:ring-1 focus-visible:border-primary gap-1',
        )}
      >
        {value ? (
          <>
            <AvatarText
              text={getUserFromUsersData(users, value)?.fullname}
              className="w-5 h-5 text-[9px]"
            />

            {getUserFromUsersData(users, value)?.fullname}
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
        <PopoverPortal>
          <PopoverContent className="p-0" align="end">
            <Command>
              <CommandInput placeholder="Set assignee..." autoFocus />
              <IssueAssigneeDropdownContent
                onClose={() => setOpen(false)}
                users={users}
                onChange={onChange}
                value={value}
              />
            </Command>
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </div>
  );
}
