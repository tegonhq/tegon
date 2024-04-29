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
import { Separator } from 'components/ui/separator';
import {
  AssigneeLine,
  BacklogLine,
  BlockedFill,
  BlockingToLine,
  LabelFill,
  ParentIssueLine,
  PriorityHigh,
  SubIssueLine,
} from 'icons';

import { FilterTypeEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import {
  IssueAssigneeFilter,
  IssueStatusFilter,
  IssueLabelFilter,
  IssuePriorityFilter,
} from './filter-dropdowns';

function DefaultPopoverContent({
  onSelect,
  showStatus,
}: {
  onSelect: (value: string) => void;
  showStatus: boolean;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter..." />

      <CommandGroup>
        {showStatus && (
          <CommandItem
            key="Status"
            value="Status"
            className="flex items-center"
            onSelect={onSelect}
          >
            <BacklogLine size={14} className="mr-2" /> Status
          </CommandItem>
        )}
        <CommandItem
          key="Assignee"
          value="Assignee"
          className="flex items-center"
          onSelect={onSelect}
        >
          <AssigneeLine size={14} className="mr-2" />
          Assignee
        </CommandItem>
        <CommandItem
          key="Label"
          value="Label"
          className="flex items-center"
          onSelect={onSelect}
        >
          <LabelFill size={14} className="mr-2" />
          Label
        </CommandItem>
        <CommandItem
          key="Priority"
          value="Priority"
          className="flex items-center"
          onSelect={onSelect}
        >
          <PriorityHigh size={14} className="mr-2" />
          Priority
        </CommandItem>
        <Separator className="my-1" />
        <CommandItem
          key="parentIssues"
          value="isParent"
          className="flex items-center"
          onSelect={() => onSelect('isParent')}
        >
          <ParentIssueLine size={14} className="mr-2" />
          Parent issues
        </CommandItem>
        <CommandItem
          key="subIssues"
          value="isSubIssue"
          className="flex items-center"
          onSelect={() => onSelect('isSubIssue')}
        >
          <SubIssueLine size={14} className="mr-2" />
          Sub issues
        </CommandItem>
        <CommandItem
          key="blockedIssues"
          value="isBlocked"
          className="flex items-center"
          onSelect={() => onSelect('isBlocked')}
        >
          <BlockedFill size={14} className="mr-2" />
          Blocked issues
        </CommandItem>
        <CommandItem
          key="blockingIssues"
          value="isBlocking"
          className="flex items-center"
          onSelect={() => onSelect('isBlocking')}
        >
          <BlockingToLine size={14} className="mr-2" />
          Blocking issues
        </CommandItem>
      </CommandGroup>
    </Command>
  );
}

const ContentMap = {
  status: IssueStatusFilter,
  assignee: IssueAssigneeFilter,
  label: IssueLabelFilter,
  priority: IssuePriorityFilter,
};

type KeyType = keyof typeof ContentMap;

interface FilterDropdownProps {
  showStatus: boolean;
}

export function FilterDropdown({ showStatus }: FilterDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const { applicationStore } = useContextStore();
  const [filter, setFilter] = React.useState<KeyType>(undefined);

  const ContentComponent = filter ? ContentMap[filter] : ContentMap.status;

  const onChange = (value: string[] | number[], filterType: FilterTypeEnum) => {
    if (value.length === 0) {
      return applicationStore.deleteFilter(filter);
    }

    applicationStore.updateFilters({ [filter]: { filterType, value } });
  };

  const onSelect = (value: string) => {
    const isBooleanFilters = [
      'isBlocked',
      'isBlocking',
      'isParent',
      'isSubIssue',
    ];

    if (isBooleanFilters.includes(value)) {
      applicationStore.updateFilters({
        [value]: { filterType: FilterTypeEnum.IS },
      });
      setOpen(false);
    } else {
      setFilter(value as KeyType);
    }
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
          <RiFilter3Line size={16} className="mr-2" />
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
          <DefaultPopoverContent showStatus={showStatus} onSelect={onSelect} />
        )}
      </PopoverContent>
    </Popover>
  );
}
