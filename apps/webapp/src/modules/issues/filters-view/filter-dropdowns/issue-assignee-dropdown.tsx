import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';

import { IssueAssigneeDropdownContent } from 'modules/issues/components';

import type { User } from 'common/types';

import { useUsersData } from 'hooks/users';

interface IssueAssigneeDropdownProps {
  value?: string[];
  onChange?: (assigneeIds: string[]) => void;
}

export function IssueAssigneeDropdown({
  value,
  onChange,
}: IssueAssigneeDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const { users, isLoading } = useUsersData(false);

  function getUserData(userId: string) {
    if (userId === 'no-user') {
      return { username: 'No Assignee', fullname: 'No Assignee' };
    }

    return users.find((userData: User) => userData.id === userId);
  }

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="sm"
            aria-expanded={open}
            className={cn(
              'flex gap-1 items-center justify-between shadow-none !bg-transparent hover:bg-transparent p-0 border-0 focus-visible:ring-1 focus-visible:border-primary text-muted-foreground',
              value && 'text-foreground',
            )}
          >
            {value.length > 1 ? (
              <>{value.length} Assignee</>
            ) : (
              <>
                <AvatarText
                  className="h-5 w-5 text-[9px]"
                  text={getUserData(value[0]).fullname}
                />
                {getUserData(value[0]).fullname}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command>
            <CommandInput placeholder="Set assignee..." autoFocus />
            <IssueAssigneeDropdownContent
              onClose={() => setOpen(false)}
              users={users}
              onChange={onChange}
              value={value}
              multiple
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
