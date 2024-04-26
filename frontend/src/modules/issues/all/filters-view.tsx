/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiCloseLine } from '@remixicon/react';
import { observer } from 'mobx-react-lite';

import { Separator } from 'components/ui/separator';
import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { DisplayPopover } from './display-popover';
import { FilterDropdown } from './filter-dropdown';
import { IssueAssigneeDropdown } from './filter-dropdowns/issue-assignee-dropdown';
import { IssueLabelDropdown } from './filter-dropdowns/issue-label-dropdown';
import { IssueStatusDropdown } from './filter-dropdowns/issue-status-dropdown';

interface FilterViewProps {
  Actions?: React.ReactElement;
  showStatus?: boolean;
}

export const FiltersView = observer(
  ({ Actions, showStatus = true }: FilterViewProps) => {
    const { applicationStore } = useContextStore();
    const team = useCurrentTeam();
    const filters = applicationStore.filters;

    const onChange = (value: string | string[], filter: string) => {
      const filterValue = filters[filter];
      applicationStore.updateFilters({ [filter]: { ...filterValue, value } });
    };

    const removeFilter = (filter: string) => {
      applicationStore.deleteFilter(filter);
    };

    return (
      <div className="py-2 pl-8 px-4 text-xs flex justify-between gap-4 border-b">
        <div className="flex gap-4 items-center">
          {/* Status  */}
          {showStatus && filters.status && (
            <div className="flex border rounded-md">
              <div className="px-2 p-1 rounded-md rounded-r-none transparent hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 dark:text-slate-50 dark:hover:text-slate-100">
                Status
              </div>
              <Separator
                className="bg-background w-[2px]"
                orientation="vertical"
              />
              <div className="px-2 p-1 rounded-md rounded-l-none rounded-r-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 text-muted-foreground">
                {filters.status.value.length > 1 ? 'is any of' : 'is'}
              </div>
              <Separator
                className="bg-background w-[2px]"
                orientation="vertical"
              />
              <div className="flex items-center px-2 rounded-md rounded-l-none rounded-r-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 dark:text-slate-50 dark:hover:text-slate-100">
                <IssueStatusDropdown
                  value={filters.status.value}
                  onChange={(value: string[]) => onChange(value, 'status')}
                  teamIdentifier={team.identifier}
                />
              </div>
              <Separator
                className="bg-background w-[2px]"
                orientation="vertical"
              />
              <div className="px-1 flex items-center p-1 rounded-md rounded-l-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 text-muted-foreground">
                <RiCloseLine
                  size={16}
                  className="hover:text-foreground"
                  onClick={() => removeFilter('status')}
                />
              </div>
            </div>
          )}

          {/* Assignee  */}
          {filters.assignee && (
            <div className="flex border rounded-md">
              <div className="px-2 p-1 rounded-md rounded-r-none transparent hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 dark:text-slate-50 dark:hover:text-slate-100">
                Assignee
              </div>
              <Separator
                className="bg-background w-[2px]"
                orientation="vertical"
              />
              <div className="px-2 p-1 rounded-md rounded-l-none rounded-r-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 text-muted-foreground">
                {filters.assignee.value.length > 1 ? 'is any of' : 'is'}
              </div>
              <Separator
                className="bg-background w-[2px]"
                orientation="vertical"
              />
              <div className="flex items-center px-2 rounded-md rounded-l-none rounded-r-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 dark:text-slate-50 dark:hover:text-slate-100">
                <IssueAssigneeDropdown
                  value={filters.assignee.value}
                  onChange={(value: string[]) => onChange(value, 'assignee')}
                />
              </div>
              <Separator
                className="bg-background w-[2px]"
                orientation="vertical"
              />
              <div className="px-1 flex items-center p-1 rounded-md rounded-l-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 text-muted-foreground">
                <RiCloseLine
                  size={16}
                  className="hover:text-foreground"
                  onClick={() => removeFilter('assignee')}
                />
              </div>
            </div>
          )}

          {/* Label  */}
          {filters['label'] && (
            <div className="flex border rounded-md">
              <div className="px-2 p-1 rounded-md rounded-r-none transparent hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 dark:text-slate-50 dark:hover:text-slate-100">
                Label
              </div>
              <Separator
                className="bg-background w-[2px]"
                orientation="vertical"
              />
              <div className="px-2 p-1 rounded-md rounded-l-none rounded-r-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 text-muted-foreground">
                {filters.label.valuelength > 1 ? 'is any of' : 'is'}
              </div>
              <Separator
                className="bg-background w-[2px]"
                orientation="vertical"
              />
              <div className="flex items-center px-2 rounded-md rounded-l-none rounded-r-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 dark:text-slate-50 dark:hover:text-slate-100">
                <IssueLabelDropdown
                  value={filters.label.value}
                  onChange={(value: string[]) => onChange(value, 'label')}
                  teamIdentifier={team.identifier}
                />
              </div>
              <Separator
                className="bg-background w-[2px]"
                orientation="vertical"
              />
              <div className="px-1 flex items-center p-1 rounded-md rounded-l-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 text-muted-foreground">
                <RiCloseLine
                  size={16}
                  className="hover:text-foreground"
                  onClick={() => removeFilter('label')}
                />
              </div>
            </div>
          )}
          <FilterDropdown showStatus={showStatus} />
        </div>
        <div className="flex gap-2">
          <DisplayPopover />
          {Actions}
        </div>
      </div>
    );
  },
);
