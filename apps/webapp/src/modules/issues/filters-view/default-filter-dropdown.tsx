import { CommandGroup, CommandItem } from '@tegonhq/ui/components/command';
import { Separator } from '@tegonhq/ui/components/separator';
import {
  AssigneeLine,
  BlockedFill,
  BlocksFill,
  LabelLine,
  ParentIssueLine,
  PriorityHigh,
  SubIssue,
  UnscopedLine,
} from '@tegonhq/ui/icons/index';
import * as React from 'react';

export function DefaultFilterDropdown({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) {
  return (
    <CommandGroup>
      <CommandItem
        key="Status"
        value="Status"
        className="flex items-center"
        onSelect={onSelect}
      >
        <UnscopedLine size={16} className="mr-2" /> Status
      </CommandItem>

      <CommandItem
        key="Assignee"
        value="Assignee"
        className="flex items-center"
        onSelect={onSelect}
      >
        <AssigneeLine size={16} className="mr-2" />
        Assignee
      </CommandItem>
      <CommandItem
        key="Label"
        value="Label"
        className="flex items-center"
        onSelect={onSelect}
      >
        <LabelLine size={16} className="mr-2" />
        Label
      </CommandItem>
      <CommandItem
        key="Priority"
        value="Priority"
        className="flex items-center"
        onSelect={onSelect}
      >
        <PriorityHigh size={16} className="mr-2" />
        Priority
      </CommandItem>
      <Separator className="my-1" />
      <CommandItem
        key="parentIssues"
        value="isParent"
        className="flex items-center"
        onSelect={() => onSelect('isParent')}
      >
        <ParentIssueLine size={16} className="mr-2" />
        Parent issues
      </CommandItem>
      <CommandItem
        key="subIssues"
        value="isSubIssue"
        className="flex items-center"
        onSelect={() => onSelect('isSubIssue')}
      >
        <SubIssue size={14} className="mr-2" />
        Sub issues
      </CommandItem>
      <CommandItem
        key="blockedIssues"
        value="isBlocked"
        className="flex items-center"
        onSelect={() => onSelect('isBlocked')}
      >
        <BlockedFill size={16} className="mr-2 text-red-500" />
        Blocked issues
      </CommandItem>
      <CommandItem
        key="blockingIssues"
        value="isBlocking"
        className="flex items-center"
        onSelect={() => onSelect('isBlocking')}
      >
        <BlocksFill size={16} className="mr-2 text-orange-500" />
        Blocking issues
      </CommandItem>
    </CommandGroup>
  );
}
