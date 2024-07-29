import { Button } from '@tegonhq/ui/components/ui/button';
import { Command, CommandInput } from '@tegonhq/ui/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/ui/popover';
import { AddLine } from '@tegonhq/ui/icons';
import * as React from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';

import {
  ContentMap,
  DefaultPopoverContent,
  type CommandInterface,
} from './add-metadata-options';

interface AddIssueMetadataProps {
  teamIdentifier: string;
  onChange: (id: string, value: string | number | string[] | number[]) => void;
  form: UseFormReturn;
  index: number;
  hideCommands?: string[];
}

export function AddIssueMetadata({
  teamIdentifier,
  onChange,
  form,
  index,
  hideCommands,
}: AddIssueMetadataProps) {
  const values = useWatch({
    control: form.control,
    name: `issues.${index}`,
  });

  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<CommandInterface>(undefined);

  const ContentComponent = filter
    ? ContentMap[filter.name]
    : ContentMap.Assignee;

  const onSelect = (command: CommandInterface) => {
    if (command.id === 'create-sub-issue') {
      onChange(command.id, undefined);
      setOpen(false);
    } else {
      setFilter(command);
    }
  };

  const value = (filterId: string) => {
    if (filterId === 'labelIds') {
      return values[filterId] ? values[filterId] : [];
    }

    return values[filterId];
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
        <Button variant="secondary" size="sm" className="py-3">
          <AddLine size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Metadata..." />

          {filter ? (
            <ContentComponent
              onClose={() => {
                setFilter(undefined);
                setOpen(false);
              }}
              teamIdentifier={teamIdentifier}
              onChange={(value) => {
                onChange(filter.id, value);
              }}
              value={value(filter.id)}
            />
          ) : (
            <DefaultPopoverContent
              onSelect={onSelect}
              hideCommands={hideCommands}
            />
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
