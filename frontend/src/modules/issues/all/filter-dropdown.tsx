/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { RiFilter3Line } from '@remixicon/react';
import { autorun } from 'mobx';
import * as React from 'react';

import { Button } from 'components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

import { useContextStore } from 'store/global-context-provider';

import {
  IssueAssigneeFilter,
  IssueStatusFilter,
  IssueLabelFilter,
} from './filter-dropdowns';

function DefaultPopoverContent({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter..." />

      <CommandGroup>
        <CommandItem key="Status" value="Status" onSelect={onSelect}>
          Status
        </CommandItem>
        <CommandItem key="Assignee" value="Assignee" onSelect={onSelect}>
          Assignee
        </CommandItem>
        <CommandItem key="Label" value="Label" onSelect={onSelect}>
          Label
        </CommandItem>
      </CommandGroup>
    </Command>
  );
}

const ContentMap = {
  status: IssueStatusFilter,
  assignee: IssueAssigneeFilter,
  label: IssueLabelFilter,
};

type KeyType = keyof typeof ContentMap;

export function FilterDropdown() {
  const [open, setOpen] = React.useState(false);
  const { applicationStore } = useContextStore();
  const [filter, setFilter] = React.useState<KeyType>(undefined);

  const ContentComponent = filter ? ContentMap[filter] : ContentMap.status;

  const onChange = (value: string | string[]) => {
    autorun(() => {
      let filters = applicationStore.filters
        ? JSON.parse(applicationStore.filters)
        : {};

      if (value.length === 0) {
        delete filters[filter];
      } else {
        filters = { ...filters, [filter]: value };
      }

      applicationStore.update({ filters: JSON.stringify(filters) });
    });
  };

  return (
    <Popover
      open={open}
      onOpenChange={(status: boolean) => {
        if (status === false) {
          setFilter(undefined);
        }

        setOpen(status);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="xs" className="border-1 text-xs">
          <RiFilter3Line size={16} className="mr-2 text-muted-foreground" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        {filter ? (
          <ContentComponent
            onClose={() => {
              setFilter(undefined);
              setOpen(false);
            }}
            onChange={onChange}
          />
        ) : (
          <DefaultPopoverContent
            onSelect={(value: string) => setFilter(value as KeyType)}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
