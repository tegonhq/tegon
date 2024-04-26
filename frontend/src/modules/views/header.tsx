/** Copyright (c) 2024, Tegon, all rights reserved. **/

/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { cn } from 'common/lib/utils';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from 'components/ui/breadcrumb';
import { Button, buttonVariants } from 'components/ui/button';
import { TeamIcon } from 'components/ui/team-icon';
import { useCurrentTeam } from 'hooks/teams';
import { SidebarLine } from 'icons';

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
    <header className="flex justify-between pl-8 px-4 py-2 w-full border-b items-center gap-2">
      <div>
        {applicationStore.sidebarCollapsed && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              applicationStore.updateSideBar(false);
            }}
          >
            <SidebarLine size={16} />
          </Button>
        )}
        <Breadcrumb className="text-xs">
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
            <BreadcrumbLink className="text-muted-foreground">
              {title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div>
        <Link
          href={`/${workspaceSlug}/team/${team.identifier}/all`}
          className={cn(buttonVariants({ variant: 'outline', size: 'xs' }))}
        >
          New view
        </Link>
      </div>
    </header>
  );
});
