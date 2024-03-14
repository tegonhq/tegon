/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiCloseLine } from '@remixicon/react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';

import { Separator } from 'components/ui/separator';
import { useCurrentTeam } from 'hooks/teams';
import { useApplicationStore } from 'hooks/use-application-store';

import { IssueAssigneeDropdown } from './filter-dropdowns/issue-assignee-dropdown';
import { IssueLabelDropdown } from './filter-dropdowns/issue-label-dropdown';
import { IssueStatusDropdown } from './filter-dropdowns/issue-status-dropdown';

export const FiltersView = observer(() => {
  const applicationStore = useApplicationStore();
  const team = useCurrentTeam();
  const filters = JSON.parse(applicationStore.filters);

  const onChange = (value: string | string[], filter: string) => {
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

  const removeFilter = (filter: string) => {
    autorun(() => {
      const filters = applicationStore.filters
        ? JSON.parse(applicationStore.filters)
        : {};

      delete filters[filter];

      applicationStore.update({ filters: JSON.stringify(filters) });
    });
  };

  if (Object.keys(filters).length === 0) {
    return null;
  }

  return (
    <div className="py-4 pl-8 px-4 text-xs flex gap-4">
      {/* Status  */}
      {filters['status'] && filters['status'].length > 0 && (
        <div className="flex">
          <div className="px-2 p-1 rounded-md rounded-r-none transparent hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:text-gray-50 dark:hover:text-gray-100">
            Status
          </div>
          <Separator className="bg-background w-[2px]" orientation="vertical" />
          <div className="px-2 p-1 rounded-md rounded-l-none rounded-r-none hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 text-muted-foreground">
            {filters['status'].length > 1 ? 'is any of' : 'is'}
          </div>
          <Separator className="bg-background w-[2px]" orientation="vertical" />
          <div className="flex items-center px-2 rounded-md rounded-l-none rounded-r-none hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:text-gray-50 dark:hover:text-gray-100">
            <IssueStatusDropdown
              value={filters['status']}
              onChange={(value: string[]) => onChange(value, 'status')}
              teamIdentifier={team.identifier}
            />
          </div>
          <Separator className="bg-background w-[2px]" orientation="vertical" />
          <div className="px-1 flex items-center p-1 rounded-md rounded-l-none hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 text-muted-foreground">
            <RiCloseLine
              size={16}
              className="hover:text-foreground"
              onClick={() => removeFilter('status')}
            />
          </div>
        </div>
      )}

      {/* Assignee  */}
      {filters['assignee'] && filters['assignee'].length > 0 && (
        <div className="flex">
          <div className="px-2 p-1 rounded-md rounded-r-none transparent hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:text-gray-50 dark:hover:text-gray-100">
            Assignee
          </div>
          <Separator className="bg-background w-[2px]" orientation="vertical" />
          <div className="px-2 p-1 rounded-md rounded-l-none rounded-r-none hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 text-muted-foreground">
            {filters['assignee'].length > 1 ? 'is any of' : 'is'}
          </div>
          <Separator className="bg-background w-[2px]" orientation="vertical" />
          <div className="flex items-center px-2 rounded-md rounded-l-none rounded-r-none hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:text-gray-50 dark:hover:text-gray-100">
            <IssueAssigneeDropdown
              value={filters['assignee']}
              onChange={(value: string[]) => onChange(value, 'assignee')}
            />
          </div>
          <Separator className="bg-background w-[2px]" orientation="vertical" />
          <div className="px-1 flex items-center p-1 rounded-md rounded-l-none hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 text-muted-foreground">
            <RiCloseLine
              size={16}
              className="hover:text-foreground"
              onClick={() => removeFilter('assignee')}
            />
          </div>
        </div>
      )}

      {/* Label  */}
      {filters['label'] && filters['label'].length > 0 && (
        <div className="flex">
          <div className="px-2 p-1 rounded-md rounded-r-none transparent hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:text-gray-50 dark:hover:text-gray-100">
            Label
          </div>
          <Separator className="bg-background w-[2px]" orientation="vertical" />
          <div className="px-2 p-1 rounded-md rounded-l-none rounded-r-none hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 text-muted-foreground">
            {filters['label'].length > 1 ? 'is any of' : 'is'}
          </div>
          <Separator className="bg-background w-[2px]" orientation="vertical" />
          <div className="flex items-center px-2 rounded-md rounded-l-none rounded-r-none hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:text-gray-50 dark:hover:text-gray-100">
            <IssueLabelDropdown
              value={filters['label']}
              onChange={(value: string[]) => onChange(value, 'label')}
            />
          </div>
          <Separator className="bg-background w-[2px]" orientation="vertical" />
          <div className="px-1 flex items-center p-1 rounded-md rounded-l-none hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 text-muted-foreground">
            <RiCloseLine
              size={16}
              className="hover:text-foreground"
              onClick={() => removeFilter('label')}
            />
          </div>
        </div>
      )}
    </div>
  );
});
