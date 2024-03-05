/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';

interface IssuePriorityDropdownContentProps {
  onChange?: (priority: number) => void;
  onClose: () => void;
  Priorities: string[];
}

export function IssuePriorityDropdownContent({
  onChange,
  onClose,
  Priorities,
}: IssuePriorityDropdownContentProps) {
  return (
    <Command>
      <CommandInput placeholder="Set priority..." />
      <CommandGroup>
        {Priorities.map((priority, index) => {
          return (
            <CommandItem
              key={priority}
              value={`${index}`}
              onSelect={(currentValue) => {
                onChange && onChange(parseInt(currentValue, 10));
                onClose();
              }}
            >
              {priority}
            </CommandItem>
          );
        })}
      </CommandGroup>
    </Command>
  );
}
