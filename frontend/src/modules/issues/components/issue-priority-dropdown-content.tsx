/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiCheckLine } from '@remixicon/react';

import { Checkbox } from 'components/ui/checkbox';
import { Command, CommandGroup, CommandInput } from 'components/ui/command';
import { useScope } from 'hooks';
import {
  NoPriorityLine,
  PriorityHigh,
  PriorityLow,
  PriorityMedium,
  UrgentFill,
} from 'icons';

import { DropdownItem } from './dropdown-item';

interface IssuePriorityDropdownContentProps {
  onChange?: (priority: number | number[]) => void;
  onClose: () => void;
  Priorities: string[];
  multiple?: boolean;
  value: number | number[];
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
  multiple = false,

  value,
}: IssuePriorityDropdownContentProps) {
  useScope('command');

  const onValueChange = (checked: boolean, id: number) => {
    const castedValue = value as number[];

    if (checked && !castedValue.includes(id)) {
      onChange && onChange([...castedValue, id]);
    }

    if (!checked && castedValue.includes(id)) {
      const newIds = [...castedValue];
      const indexToDelete = newIds.indexOf(id);

      newIds.splice(indexToDelete, 1);
      onChange && onChange(newIds);
    }
  };

  return (
    <Command>
      <CommandInput placeholder="Set priority..." autoFocus />
      <CommandGroup>
        {Priorities.map((priority, index) => {
          const PriorityIcon = PriorityIcons[index];

          return (
            <DropdownItem
              key={priority}
              id={index}
              value={priority}
              index={index}
              onSelect={(currentValue: number) => {
                if (!multiple) {
                  onChange && onChange(currentValue);
                  onClose();
                }
              }}
            >
              <div className="flex justify-between w-full items-center">
                <div className="flex gap-2 items-center">
                  {multiple && (
                    <Checkbox
                      id={priority}
                      checked={(value as number[]).includes(index)}
                      onCheckedChange={(value: boolean) => {
                        onValueChange(value, index);
                      }}
                    />
                  )}
                  <label htmlFor={priority} className="flex grow">
                    <PriorityIcon.icon
                      size={PriorityIcon.size}
                      className="text-muted-foreground mr-2"
                    />
                    {priority}
                  </label>
                </div>

                {index === value && (
                  <div>
                    <RiCheckLine size={14} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            </DropdownItem>
          );
        })}
      </CommandGroup>
    </Command>
  );
}
