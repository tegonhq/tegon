/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { DisplayPopover } from './display-popover';
import { FilterDropdown } from './filter-dropdown';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex pl-8 px-4 py-4 w-full border-b justify-between items-center">
      <div className="flex gap-4 items-center">
        <h3 className="text-sm font-medium"> {title} </h3>
        <FilterDropdown />
      </div>
      <div className="flex gap-4 items-center">
        <DisplayPopover />
      </div>
    </header>
  );
}
