/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { DisplayPopover } from './display-popover';
import { FilterDropdown } from './filter-dropdown';

export function Header() {
  return (
    <header className="flex pl-8 px-4 py-4 w-full border-b justify-between items-center">
      <div className="flex gap-4 items-center">
        <h3 className="text-sm font-medium"> All Issues </h3>
        <FilterDropdown />
      </div>
      <div className="flex gap-4 items-center">
        <DisplayPopover />
      </div>
    </header>
  );
}
