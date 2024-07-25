import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface HeaderProps {
  title: string;
}

export const Header = observer(({ title }: HeaderProps) => {
  const {
    query: { workspaceSlug },
  } = useRouter();

  return (
    <header className="flex px-6 py-4 w-full items-center gap-2">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            className="flex items-center gap-2"
            href={`/${workspaceSlug}/settings`}
          >
            Settings
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>{title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </header>
  );
});
