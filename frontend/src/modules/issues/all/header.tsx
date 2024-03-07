/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiEqualizerFill, RiNotification3Fill } from '@remixicon/react';

import { Button } from 'components/ui/button';

import { FilterDropdown } from './filter-dropdown';

export function Header() {
  return (
    <header className="flex pl-8 px-4 py-4 w-full border-b justify-between items-center">
      <div className="flex gap-4 items-center">
        <h3 className="text-sm font-medium"> All Issues </h3>
        <FilterDropdown />
      </div>
      <div className="flex gap-4 items-center">
        <Button size="xs" variant="outline" className="text-xs">
          <RiEqualizerFill size={14} className="mr-2 text-muted-foreground" />
          Display
        </Button>
        <Button size="xs" variant="outline" className="text-xs">
          <RiNotification3Fill
            size={14}
            className="mr-2 text-muted-foreground"
          />
          Notification
        </Button>
      </div>
    </header>
  );
}
