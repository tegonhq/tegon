import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { Inbox } from '@tegonhq/ui/icons';

import { SidebarExpand } from 'common/sidebar-expand';

export function Header() {
  return (
    <header className="flex px-6 w-full items-center gap-2">
      <div className="flex justify-between w-full py-3">
        <div className="flex gap-2 items-center">
          <SidebarExpand />

          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink className="flex items-center gap-2">
                <Inbox size={20} />

                <span className="inline-block"> Inbox</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
    </header>
  );
}
