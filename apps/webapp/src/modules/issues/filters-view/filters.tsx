import { RiLoader4Line } from '@remixicon/react';
import { Button } from '@tegonhq/ui/components/button';
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from '@tegonhq/ui/components/command';
import { AI, CrossLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useScope } from 'hooks';
import { useCurrentTeam } from 'hooks/teams';
import { useFiltersFromAI } from 'hooks/use-filters-from-ai';
import { useCurrentWorkspace } from 'hooks/workspace';

import { useAIFilterIssuesMutation } from 'services/issues';

import { FilterTypeEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { AppliedFiltersView } from './applied-filters-view';
import { DefaultFilterDropdown } from './default-filter-dropdown';
import {
  IssueAssigneeFilter,
  IssueStatusFilter,
  IssueLabelFilter,
  IssuePriorityFilter,
  IssueProjectFilter,
} from './filter-dropdowns';
import { isEmpty } from './filter-utils';
import { useFilterShorcuts } from './use-filter-shortcuts';

const ContentMap = {
  status: IssueStatusFilter,
  assignee: IssueAssigneeFilter,
  label: IssueLabelFilter,
  priority: IssuePriorityFilter,
  project: IssueProjectFilter,
};

export type KeyType = keyof typeof ContentMap;

interface FiltersProps {
  onClose: () => void;
}

const LOCAL_SCOPE = 'FILTERS';

export const Filters = observer(({ onClose }: FiltersProps) => {
  useScope(LOCAL_SCOPE);

  const {
    applicationStore,
    applicationStore: { filters },
  } = useContextStore();
  const team = useCurrentTeam();
  const workspace = useCurrentWorkspace();
  const [filter, setFilter] = React.useState<KeyType>(undefined);
  const [value, setValue] = React.useState('');
  const [timeout, setTimeoutValue] = React.useState(undefined);
  const inputRef = React.useRef(null);
  const [isLoading, setLoading] = React.useState(false);
  const [showOption, setShowOptions] = React.useState(false);
  const { setFilters } = useFiltersFromAI();

  const { mutate: aiFilterIssues } = useAIFilterIssuesMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      setFilters(data);
      setShowOptions(false);
      setLoading(false);
      setValue('');
    },
  });

  function onEscape() {
    if (filter) {
      setFilter(undefined);
      inputRef.current.blur();
      return;
    }

    if (showOption) {
      setShowOptions(false);
      inputRef.current.blur();
    }
  }

  // Shortcuts
  useFilterShorcuts(
    {
      onEscape,
      onF: () => inputRef.current.focus(),
    },
    [filter, showOption],
  );

  const onSelect = (value: string) => {
    clearTimeoutValue();
    inputRef.current.focus();

    if (value.includes('ai:')) {
      setLoading(true);
      aiFilterIssues({
        teamId: team?.id,
        workspaceId: workspace.id,
        text: value.replace('ai: ', ''),
      });

      return;
    }

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
    } else {
      setFilter(value as KeyType);
      inputRef.current.focus();
    }

    setValue('');
  };

  const ContentComponent = filter ? ContentMap[filter] : ContentMap.status;

  const clearTimeoutValue = () => {
    clearTimeout(timeout);
    setTimeoutValue(undefined);
  };

  const onChange = (value: string[] | number[], filterType: FilterTypeEnum) => {
    clearTimeoutValue();
    inputRef.current.focus();

    if (value.length === 0) {
      return applicationStore.deleteFilter(filter);
    }

    applicationStore.updateFilters({ [filter]: { filterType, value } });
  };

  return (
    <div className="flex justify-between items-start border border-border p-1 rounded-md w-full">
      <div className="flex gap-2 flex-wrap items-center h-full grow">
        <AppliedFiltersView />
        {isLoading && (
          <div className="flex gap-2 items-center">
            <RiLoader4Line size={18} className="animate-spin" />
            <p> Fetching filter</p>
          </div>
        )}
        {!isLoading && (
          <Command
            className="border-none shadow-none relative overflow-visible h-fit w-auto"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onBlur={(e) => {
              if (e.target.localName === 'button' && e.relatedTarget === null) {
                setShowOptions(false);
                setFilter(undefined);
              }
            }}
          >
            <CommandInput
              placeholder="Type for filters..."
              value={value}
              onValueChange={setValue}
              containerClassName="border-0 rounded-md min-w-[400px] pl-0 py-1 bg-background-2"
              className="py-2 h-4 pl-1"
              autoFocus={isEmpty(filters)}
              ref={inputRef}
              onFocus={() => setShowOptions(true)}
              onBlur={() => {
                const t = setTimeout(() => {
                  setShowOptions(false);
                  setFilter(undefined);
                }, 200);
                setTimeoutValue(t);
              }}
            />

            {showOption && (
              <CommandList className="absolute rounded-md shadow-1 border-[#ffffff38] min-w-[250px] top-8 z-10 bg-popover">
                {filter ? (
                  <ContentComponent
                    onClose={() => {
                      setShowOptions(false);
                      setFilter(undefined);
                    }}
                    onChange={onChange}
                  />
                ) : (
                  <DefaultFilterDropdown onSelect={onSelect} />
                )}
                {value && (
                  <CommandGroup>
                    <CommandItem
                      key="AI"
                      value={`AI: ${value}`}
                      className="flex items-center gap-1"
                      onSelect={onSelect}
                    >
                      <AI size={16} />

                      <span>
                        Ai filter -
                        <span className="text-muted-foreground ml-1">
                          {value}
                        </span>
                      </span>
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            )}
          </Command>
        )}
      </div>

      <div className="border-l flex items-start h-full">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <CrossLine />
        </Button>
      </div>
    </div>
  );
});
