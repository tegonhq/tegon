/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { useCurrentTeam } from 'hooks/teams';
import { Close } from 'icons';

import type { FilterTypeEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { FilterOptionsDropdown } from './filter-options-dropdown';

interface FilterItemViewProps {
  name: string;
  filterKey: string;
  value: string[] | boolean;
  filterType: FilterTypeEnum;
  isArray?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>;
}

export const FilterItemView = observer(
  ({
    name,
    value,
    filterKey,
    isArray = false,
    Component,
    filterType,
  }: FilterItemViewProps) => {
    const { applicationStore } = useContextStore();
    const filters = applicationStore.filters;
    const team = useCurrentTeam();

    const onChange = (value: string | string[]) => {
      if (value.length === 0) {
        return applicationStore.deleteFilter(filterKey);
      }

      const filterValue = filters[filterKey];
      applicationStore.updateFilters({
        [filterKey]: { ...filterValue, value },
      });
    };

    const onChangeFilterType = (filterType: FilterTypeEnum) => {
      const filterValue = filters[filterKey];
      applicationStore.updateFilters({
        [filterKey]: { ...filterValue, filterType },
      });
    };

    const removeFilter = () => {
      applicationStore.deleteFilter(filterKey);
    };

    return (
      <div className="flex bg-grayAlpha-100 rounded-md items-center">
        <div className="px-2 p-1 rounded-md rounded-r-none transparent">
          {name}
        </div>
        <Separator className="bg-white w-[1px]" orientation="vertical" />
        <FilterOptionsDropdown
          onChange={onChangeFilterType}
          isArray={isArray}
          filterType={filterType}
        />
        <Separator className="bg-white w-[1px]" orientation="vertical" />
        <div className="flex items-center px-2 rounded-md rounded-l-none rounded-r-none">
          <Component
            value={value}
            onChange={onChange}
            teamIdentifier={team.identifier}
          />
        </div>
        <Separator className="bg-white w-[1px]" orientation="vertical" />

        <Button
          className="flex items-center p-1 rounded-md rounded-l-none"
          onClick={removeFilter}
          variant="ghost"
          size="sm"
        >
          <Close size={16} className="hover:text-foreground" />
        </Button>
      </div>
    );
  },
);
