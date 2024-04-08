/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { RiFilter3Line } from '@remixicon/react';
import * as React from 'react';

import { Button } from 'components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { AssigneeLine, BacklogLine, LabelFill } from 'icons';

import type { FilterType } from 'store/application';
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
        <CommandItem
          key="Status"
          value="Status"
          className="flex items-center text-muted-foreground"
          onSelect={onSelect}
        >
          <BacklogLine size={14} className="mr-2" /> Status
        </CommandItem>
        <CommandItem
          key="Assignee"
          value="Assignee"
          className="flex items-center text-muted-foreground"
          onSelect={onSelect}
        >
          <AssigneeLine size={14} className="mr-2" />
          Assignee
        </CommandItem>
        <CommandItem
          key="Label"
          value="Label"
          className="flex items-center text-muted-foreground"
          onSelect={onSelect}
        >
          <LabelFill size={14} className="mr-2" />
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

  const onChange = (value: string[], filterType: FilterType) => {
    if (value.length === 0) {
      return applicationStore.deleteFilter(filter);
    }

    applicationStore.updateFilters({ [filter]: { filterType, value } });
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
      <PopoverContent className="w-72 p-0" align="start">
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
