import { CommandGroup, CommandItem } from '@tegonhq/ui/components/command';
import * as React from 'react';

import { allCommands } from './add-issue-metadata-interface';
import {
  IssueAssigneeDropdownWithoutContext,
  IssueLabelDropdownWithoutContext,
  IssuePriorityDropdownWithoutContext,
} from '../issue-metadata';

export function DefaultPopoverContent({
  onSelect,
  hideCommands = [],
}: {
  onSelect: (command: CommandInterface) => void;
  hideCommands?: string[];
}) {
  const getCommands = () => {
    if (hideCommands && hideCommands.length > 0) {
      return allCommands.filter(
        (command) => !hideCommands.includes(command.id),
      );
    }

    return allCommands;
  };

  return (
    <CommandGroup>
      {getCommands().map((command) => (
        <CommandItem
          key={command.name}
          value={command.name}
          className="flex items-center"
          onSelect={() =>
            onSelect({ name: command.name as KeyType, id: command.id })
          }
        >
          <command.Icon size={16} className="mr-2" />
          {command.name}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

export const ContentMap = {
  Assignee: IssueAssigneeDropdownWithoutContext,
  Label: IssueLabelDropdownWithoutContext,
  Priority: IssuePriorityDropdownWithoutContext,
};

export type KeyType = keyof typeof ContentMap;

export interface CommandInterface {
  name: KeyType;
  id: string;
}
