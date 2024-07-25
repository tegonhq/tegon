import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { Button, buttonVariants } from '@tegonhq/ui/components/button';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { SidebarLine } from '@tegonhq/ui/icons/index';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

interface HeaderProps {
  title: string;
}

export const Header = observer(({ title }: HeaderProps) => {
  const team = useCurrentTeam();
  const { applicationStore } = useContextStore();
  const {
    query: { workspaceSlug },
  } = useRouter();

  return (
    <header className="flex px-6 w-full items-center gap-2 justify-between">
      <div className="py-4">
        {applicationStore.sidebarCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              applicationStore.updateSideBar(false);
            }}
          >
            <SidebarLine size={16} />
          </Button>
        )}
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              className="flex items-center gap-2 font-medium"
              href={`/${workspaceSlug}/team/${team.identifier}/all`}
            >
              <TeamIcon name={team.name} />

              <span className="inline-block">{team.name}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>{title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="py-2">
        <Link
          href={`/${workspaceSlug}/team/${team.identifier}/all`}
          className={cn(buttonVariants({ variant: 'secondary' }))}
        >
          New view
        </Link>
      </div>
    </header>
  );
});
