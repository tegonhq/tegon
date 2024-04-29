/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from 'components/ui/dropdown-menu';

import { FilterTypeEnum } from 'store/application';

const FilterToName = {
  [FilterTypeEnum.IS]: 'is any of',
  [FilterTypeEnum.IS_NOT]: 'is not',
  [FilterTypeEnum.INCLUDES]: 'includes all of',
  [FilterTypeEnum.INCLUDES_ANY]: 'includes any of',
  [FilterTypeEnum.EXCLUDES]: 'excludes all of',
  [FilterTypeEnum.EXCLUDES_ANY]: 'excludes any of',
  [FilterTypeEnum.UNDEFINED]: 'undefined',
};

interface FilterOptionsDropdownProps {
  filterType: FilterTypeEnum;
  onChange: (filterType: FilterTypeEnum) => void;
  // Defines whether the filter value is of array or a string
  // Like labels is array but assignee is not
  isArray: boolean;
}

export function FilterOptionsDropdown({
  onChange,
  filterType,
  isArray,
}: FilterOptionsDropdownProps) {
  const options = isArray
    ? [
        FilterTypeEnum.INCLUDES,
        FilterTypeEnum.INCLUDES_ANY,
        FilterTypeEnum.EXCLUDES,
        FilterTypeEnum.EXCLUDES_ANY,
      ]
    : [FilterTypeEnum.IS, FilterTypeEnum.IS_NOT];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="px-2 p-1 rounded-md rounded-l-none rounded-r-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 text-muted-foreground">
          {FilterToName[filterType]}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem key={option} onClick={() => onChange(option)}>
            {FilterToName[option]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
