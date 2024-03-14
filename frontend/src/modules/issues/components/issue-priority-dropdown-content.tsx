/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiCheckLine,
  RiErrorWarningFill,
  RiSubtractLine,
} from '@remixicon/react';
import { Signal, SignalHigh, SignalMedium } from 'lucide-react';

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
  value: number;
}

export const PriorityIcons = [
  { icon: RiSubtractLine, size: 18 },
  { icon: RiErrorWarningFill, size: 18 },
  { icon: Signal, size: 18 },
  { icon: SignalHigh, size: 18 },
  { icon: SignalMedium, size: 18 },
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
              value={`${index}`}
              onSelect={(currentValue) => {
                onChange && onChange(parseInt(currentValue, 10));
                onClose();
              }}
            >
              <div className="flex justify-between w-full items-center">
                <div className="flex">
                  <PriorityIcon.icon
                    size={PriorityIcon.size}
                    className="text-muted-foreground mr-2"
                  />
                  {priority}
                </div>

                {index === value && (
                  <div>
                    <RiCheckLine size={14} />
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
