/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiAddLine } from '@remixicon/react';
import React from 'react';

import { generateOklchColor } from 'common/color-utils';
import type { LabelType } from 'common/types/label';

import { BadgeColor } from 'components/ui/badge';
import { Checkbox } from 'components/ui/checkbox';
import { CommandGroup, CommandItem, CommandList } from 'components/ui/command';
import { Separator } from 'components/ui/separator';
import { useCurrentWorkspace } from 'hooks/workspace';

import { useCreateLabelMutation } from 'services/labels/create-label';

interface IssueLabelDropdownContentProps {
  labels: LabelType[];
  value: string[];
  onChange?: (value: string[]) => void;
  setLabelSearch: (value: string) => void;
  labelSearch: string;
}

export function IssueLabelDropdownContent({
  labels,
  value,
  onChange,
  setLabelSearch,
  labelSearch,
}: IssueLabelDropdownContentProps) {
  const workspace = useCurrentWorkspace();
  const { mutate: createLabel } = useCreateLabelMutation({
    onSuccess: (data: LabelType) => {
      onValueChange(true, data.id);
      setLabelSearch('');
    },
  });

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

  const filter = () => {
    return labels.filter((label: LabelType) =>
      label.name.toLowerCase().includes(labelSearch.toLowerCase()),
    );
  };

  const exactMatch = () => {
    return labels.filter(
      (label: LabelType) =>
        label.name.toLowerCase() === labelSearch.toLowerCase(),
    );
  };
  return (
    <CommandList>
      <CommandGroup>
        {filter().map((label: LabelType) => {
          return (
            <CommandItem key={label.name} className="my-1" value={label.name}>
              <div className="flex gap-2 items-center w-full">
                <Checkbox
                  id={label.id}
                  checked={value.includes(label.id)}
                  onCheckedChange={(value: boolean) =>
                    onValueChange(value, label.id)
                  }
                />
                <label
                  htmlFor={label.id}
                  className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <BadgeColor
                    style={{ backgroundColor: label.color }}
                    className="w-2 h-2"
                  />
                  {label.name}
                </label>
              </div>
            </CommandItem>
          );
        })}
        {labelSearch && exactMatch().length === 0 && (
          <>
            {filter().length > 0 && <Separator />}
            <CommandItem
              className="my-1"
              value={labelSearch}
              onSelect={() => {
                createLabel({
                  name: labelSearch,
                  workspaceId: workspace.id,
                  color: generateOklchColor(),
                });
              }}
            >
              <div className="flex gap-2 items-center">
                <label className="flex items-center font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  <RiAddLine size={16} className="mr-2" /> Create
                  <span className="text-muted-foreground ml-1">
                    {labelSearch}
                  </span>
                </label>
              </div>
            </CommandItem>
          </>
        )}
      </CommandGroup>
    </CommandList>
  );
}
