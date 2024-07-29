import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { Inbox } from '@tegonhq/ui/icons';

export function Header() {
  return (
    <header className="flex px-6 py-4 w-full items-center gap-2">
      <div className="flex gap-4 items-center">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink className="flex items-center gap-2">
              <div className="p-[2px] w-5 h-5 bg-[#89C794] rounded-sm flex items-center justify-center">
                <Inbox size={14} />
              </div>

              <span className="inline-block"> Inbox</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </header>
  );
}
