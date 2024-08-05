import type { IssueType } from 'common/types';

import { useGetSearchIssuesQuery } from '@tegonhq/services/search';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@tegonhq/ui/components/command';
import { Loader } from '@tegonhq/ui/components/loader';
import { useRouter } from 'next/router';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { ModalIssueItem } from 'modules/issues/components/modals/modal-issue-item';

import { useCurrentWorkspace } from 'hooks/workspace';

interface SearchDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

interface SearchIssueType extends IssueType {
  issueNumber: string;
}

export function SearchDialog({ open, setOpen }: SearchDialogProps) {
  const workspace = useCurrentWorkspace();
  const [query, setQuery] = React.useState('');
  const { push } = useRouter();

  const {
    data: issues,
    isLoading,
    refetch,
  } = useGetSearchIssuesQuery({
    workspaceId: workspace.id,
    query,
  });

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchData = useDebouncedCallback(() => {
    refetch();
  }, 500);

  const onSelect = (value: string) => {
    push(`/${workspace.slug}/issue/${value.toUpperCase()}`);
    setOpen(false);
    setQuery('');
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      commandProps={{ shouldFilter: false }}
    >
      <CommandInput
        placeholder="Type a command or search..."
        onValueChange={(value: string) => setQuery(value)}
      />
      {!isLoading && issues && issues.length === 0 && (
        <CommandEmpty>
          <span className="text-muted-foreground">No results found.</span>
        </CommandEmpty>
      )}
      {isLoading && <Loader />}
      {!isLoading && issues && (
        <CommandList className="py-2">
          {issues.filter(Boolean).map((issue: SearchIssueType) => (
            <CommandItem
              key={issue.id}
              value={issue.issueNumber}
              className="m-2"
              onSelect={onSelect}
            >
              <ModalIssueItem issue={issue} />
            </CommandItem>
          ))}
        </CommandList>
      )}
    </CommandDialog>
  );
}
