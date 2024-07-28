import { CommandGroup, CommandItem } from '@tegonhq/ui/components/command';
import * as React from 'react';

import { allCommands } from './add-issue-metadata-interface';
import {
  IssueAssigneeDropdownWithoutContext,
  IssueLabelDropdownWithoutContext,
  IssuePriorityDropdownWithoutContext,
} from '../metadata-dropdowns';

export function DefaultPopoverContent({
  onSelect,
  commands = [],
}: {
  onSelect: (command: CommandInterface) => void;
  commands?: string[];
}) {
  const getCommands = () => {
    if (commands && commands.length > 0) {
      return allCommands.filter((command) => commands.includes(command.name));
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
