/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiArrowLeftSLine, RiSideBarFill } from '@remixicon/react';

import { Button } from 'components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from 'components/ui/sheet';

import { SidebarNav } from './sidebar-nav';

export function SideDrawer() {
  return (
    <Sheet>
      <div className="block md:hidden">
        <header className="flex px-2 py-3 w-full border-b items-center">
          <SheetTrigger asChild>
            <Button variant="ghost" className="">
              <RiSideBarFill size={20} />
            </Button>
          </SheetTrigger>

          <Button
            variant="ghost"
            size="sm"
            className="text-sm flex justify-start px-1 pr-2"
          >
            <RiArrowLeftSLine
              className="mr-2 text-muted-foreground"
              size={20}
            />
            Settings
          </Button>
        </header>

        <SheetContent side="left" className="p-0">
          <SidebarNav />
        </SheetContent>
      </div>
    </Sheet>
  );
}
