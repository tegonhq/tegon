import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { Button } from '@tegonhq/ui/components/button';
import { observer } from 'mobx-react-lite';

import { SidebarExpand } from 'common/sidebar-expand';

interface HeaderProps {
  title: string;
}

export const Header = observer(({ title }: HeaderProps) => {
  return (
    <header className="flex px-6 w-full items-center gap-2">
      <div className="flex gap-2 py-3 items-center w-full">
        <div className="flex grow justify-start items-center">
          <SidebarExpand />
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink>{title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center ml-2 gap-1">
            <Button variant="secondary" isActive>
              {' '}
              Overview
            </Button>
            <Button variant="secondary"> Issues</Button>
          </div>
        </div>

        <div>
          <Button variant="secondary"> Create project</Button>
        </div>
      </div>
    </header>
  );
});
