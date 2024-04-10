/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { RiCheckLine } from '@remixicon/react';
import React from 'react';

import { cn } from 'common/lib/utils';

import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog as CommandDialogC,
} from 'components/ui/command';
import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

interface Option {
  Icon: React.ReactElement;
  text: string;
  value: string;
}

interface CommonDialogProps {
  issueIds: string[];
  placeholder: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  options: Option[];
  currentValue?: string[];
  multiple?: boolean;
  onSelect: (value: string) => void;
}

export function CommonDialog({
  issueIds,
  placeholder,
  open,
  setOpen,
  options,
  currentValue,
  multiple = false,
  onSelect,
}: CommonDialogProps) {
  const { issuesStore, applicationStore } = useContextStore();
  const issues = issuesStore.getIssuesFromArray(issueIds);
  const team = useCurrentTeam();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    return () => {
      applicationStore.clearSelectedIssues();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getIssuesTitle() {
    if (issues.length === 1) {
      const issue = issues[0];
      return (
        <div className="bg-active rounded-md p-2 py-1 flex gap-2">
          <div>
            {team.identifier}-{issue.number}
          </div>
          <div className="max-w-[300px]">
            <div className="truncate">{issue.title}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-active rounded-md p-2 py-1 flex gap-2">
        <div>{issues.length} issues</div>
      </div>
    );
  }

  return (
    <CommandDialogC open={open} onOpenChange={setOpen}>
      <div className="p-2 flex justify-start w-full">
        <div className="text-xs">{getIssuesTitle()}</div>
      </div>
      <CommandInput
        placeholder={placeholder}
        value={value}
        onValueChange={(value: string) => setValue(value)}
      />
      <CommandList className="p-2">
        <CommandEmpty>No results found.</CommandEmpty>

        {options.map((option, index: number) => (
          <CommandItem
            key={option.value}
            onSelect={() => {
              onSelect(option.value);
              !multiple && setOpen(false);
            }}
            className={cn(
              '!py-2 !px-3 justify-between',
              index === options.length - 1 ? 'mb-0' : 'mb-2',
            )}
          >
            <div className="flex gap-3">
              <div>{option.Icon}</div>
              <div>{option.text}</div>
            </div>
            <div>
              {currentValue && currentValue.includes(option.value) && (
                <RiCheckLine className="!h-4 !w-4" />
              )}
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialogC>
  );
}
