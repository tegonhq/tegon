import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { Inbox } from '@tegonhq/ui/icons';

import { HeaderLayout } from 'common/header-layout';

export function Header() {
  return (
    <HeaderLayout>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink className="flex items-center gap-2">
            <Inbox size={20} />

            <span className="inline-block"> Inbox</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </HeaderLayout>
  );
}
