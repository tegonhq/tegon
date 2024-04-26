/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiCheckLine } from '@remixicon/react';

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';
import {
  NoPriorityLine,
  PriorityHigh,
  PriorityLow,
  PriorityMedium,
  UrgentFill,
} from 'icons';

interface IssuePriorityDropdownContentProps {
  onChange?: (priority: number) => void;
  onClose: () => void;
  Priorities: string[];
  value: number;
}

export const PriorityIcons = [
  { icon: NoPriorityLine, size: 16 },
  { icon: UrgentFill, size: 16 },
  { icon: PriorityHigh, size: 16 },
  { icon: PriorityMedium, size: 16 },
  { icon: PriorityLow, size: 16 },
];

export function IssuePriorityDropdownContent({
  onChange,
  onClose,
  Priorities,
  value,
}: IssuePriorityDropdownContentProps) {
  return (
    <Command>
      <CommandInput placeholder="Set priority..." />
      <CommandGroup>
        {Priorities.map((priority, index) => {
          const PriorityIcon = PriorityIcons[index];

          return (
            <CommandItem
              key={priority}
              value={priority}
              onSelect={() => {
                onChange && onChange(index);
                onClose();
              }}
            >
              <div className="flex justify-between w-full items-center">
                <div className="flex items-center">
                  <PriorityIcon.icon
                    size={PriorityIcon.size}
                    className="text-muted-foreground mr-2"
                  />
                  {priority}
                </div>

                {index === value && (
                  <div>
                    <RiCheckLine size={14} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            </CommandItem>
          );
        })}
      </CommandGroup>
    </Command>
  );
}
