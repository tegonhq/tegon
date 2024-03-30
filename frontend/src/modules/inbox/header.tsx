/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Inbox } from 'icons';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from 'components/ui/breadcrumb';

export function Header() {
  return (
    <header className="flex px-4 py-3.5 w-full border-b justify-between items-center">
      <div className="flex gap-4 items-center text-sm">
        <Breadcrumb className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink className="flex items-center gap-2 font-medium">
              <div className="p-[2px] w-5 h-5 bg-primary/10 rounded-sm flex items-center">
                <Inbox size={14} className="text-foreground" />
              </div>

              <span className="inline-block"> Inbox</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </header>
  );
}
