/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { LabelType } from 'common/types/label';

import { Checkbox } from 'components/ui/checkbox';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';

interface IssueLabelDropdownContentProps {
  labels: LabelType[];
  value: string[];
  onChange?: (value: string[]) => void;
}

export function IssueLabelDropdownContent({
  labels,
  value,
  onChange,
}: IssueLabelDropdownContentProps) {
  const onValueChange = (checked: boolean, id: string) => {
    if (checked && !value.includes(id)) {
      onChange && onChange([...value, id]);
    }

    if (!checked && value.includes(id)) {
      const newIds = [...value];
      const indexToDelete = newIds.indexOf(id);

      newIds.splice(indexToDelete, 1);
      onChange && onChange(newIds);
    }
  };

  return (
    <Command>
      <CommandInput placeholder="Set label..." />

      <CommandGroup>
        {labels.map((label: LabelType) => {
          return (
            <CommandItem key={label.name} className="my-1" value={label.name}>
              <div className="flex gap-2 items-center ">
                <Checkbox
                  id={label.name}
                  checked={value.includes(label.id)}
                  onCheckedChange={(value: boolean) =>
                    onValueChange(value, label.id)
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label.name}
                </label>
              </div>
            </CommandItem>
          );
        })}
      </CommandGroup>
    </Command>
  );
}
