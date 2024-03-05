/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { UsersOnWorkspaceType } from 'common/types/workspace';

import { Button } from 'components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useCurrentWorkspace, useWorkspaceStore } from 'hooks/workspace';

interface IssueAssigneeProps {
  value?: string;
  onChange?: (assigneeId: string) => void;
}

export function IssueAssignee({ value, onChange }: IssueAssigneeProps) {
  const [open, setOpen] = React.useState(false);
  const currentWorkspace = useCurrentWorkspace();
  const workspaceStore = useWorkspaceStore();
  const users = workspaceStore.usersOnWorkspaces.filter(
    (uOW: UsersOnWorkspaceType) => uOW.workspaceId === currentWorkspace.id,
  );

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="xs"
            aria-expanded={open}
            className="flex items-center justify-between text-xs font-normal focus-visible:ring-1 focus-visible:border-primary text-muted-foreground"
          >
            {value}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Set assignee..." />
            <CommandGroup>
              {users.map((user: UsersOnWorkspaceType) => {
                return (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={(currentValue) => {
                      onChange && onChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    {user.id}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
