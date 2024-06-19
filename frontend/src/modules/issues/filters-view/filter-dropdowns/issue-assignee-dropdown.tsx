/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { IssueAssigneeDropdownContent } from 'modules/issues/components';

import { cn } from 'common/lib/utils';

import { AvatarText } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useUsersData } from 'hooks/users/use-users-data';

import type { User } from 'store/user-context';

interface IssueAssigneeDropdownProps {
  value?: string[];
  onChange?: (assigneeIds: string[]) => void;
}

export function IssueAssigneeDropdown({
  value,
  onChange,
}: IssueAssigneeDropdownProps) {
  const [open, setOpen] = React.useState(false);

  const { usersData, isLoading } = useUsersData();

  function getUserData(userId: string) {
    if (userId === 'no-user') {
      return { username: 'No Assignee', fullname: 'No Assignee' };
    }

    return usersData.find((userData: User) => userData.id === userId);
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
            size="xs"
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
          <IssueAssigneeDropdownContent
            onClose={() => setOpen(false)}
            usersData={usersData}
            onChange={onChange}
            value={value}
            multiple
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
