import { RiCheckLine } from '@remixicon/react';
import React from 'react';

import { cn } from 'common/lib/utils';

import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog as CommandDialogC,
  CommandGroup,
} from 'components/ui/command';

import { useContextStore } from 'store/global-context-provider';

export interface Option {
  Icon: React.ReactElement;
  text: string | React.ReactElement;
  value: string;
  group?: string;
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
  groupOrder?: string[];
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
  groupOrder,
}: CommonDialogProps) {
  const { issuesStore, applicationStore, teamsStore } = useContextStore();
  const issues = issuesStore.getIssuesFromArray(issueIds);
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    return () => {
      applicationStore.clearSelectedIssues();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getIssuesTitle() {
    if (issues.length === 0) {
      return null;
    }

    if (issues.length === 1) {
      const issue = issues[0];
      const team = teamsStore.getTeamWithId(issue.teamId);
      return (
        <div className="p-2 flex justify-start w-full">
          <div>
            <div className="bg-accent text-accent-foreground rounded-md p-2 py-1 flex gap-2">
              <div>
                {team.identifier}-{issue.number}
              </div>
              <div className="max-w-[300px]">
                <div className="truncate">{issue.title}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-2 flex justify-start w-full">
        <div>
          <div className="bg-accent rounded-md p-2 py-1 flex gap-2">
            <div>{issues.length} issues</div>
          </div>
        </div>
      </div>
    );
  }

  const getOptions = () => {
    if (groupOrder && groupOrder.length > 0) {
      return (
        <>
          {groupOrder.map((group) => (
            <CommandGroup heading={group} key="group" className="p-0">
              {options
                .filter((op) => op.group === group)
                .map((option, index: number) => (
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
                    <div className="flex items-center gap-3">
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
            </CommandGroup>
          ))}
        </>
      );
    }

    return (
      <>
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
            <div className="flex items-center gap-3">
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
      </>
    );
  };

  return (
    <CommandDialogC open={open} onOpenChange={setOpen}>
      {getIssuesTitle()}
      <CommandInput
        placeholder={placeholder}
        value={value}
        onValueChange={(value: string) => setValue(value)}
      />
      <CommandList className="p-2">
        <CommandEmpty>No results found.</CommandEmpty>
        {getOptions()}
      </CommandList>
    </CommandDialogC>
  );
}
