import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { SidebarExpand } from 'common/sidebar-expand';
import type { TeamType } from 'common/types';

interface HeaderProps {
  title: string;
  team?: TeamType;
  actions?: React.ReactElement;
}

export const Header = observer(({ title, team, actions }: HeaderProps) => {
  const {
    query: { workspaceSlug },
  } = useRouter();

  return (
    <header className="flex px-6 w-full items-center gap-2">
      <div
        className={cn(
          'flex justify-between w-full',
          actions ? 'py-2.5' : 'py-3',
        )}
      >
        <div className="flex gap-2 items-center">
          <SidebarExpand />

          <Breadcrumb>
            {team && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  as={Link}
                  className="flex items-center gap-2"
                  href={`/${workspaceSlug}/team/${team.identifier}/all`}
                >
                  <TeamIcon name={team.name} />

                  <span className="inline-block">{team.name}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            <BreadcrumbItem>
              <BreadcrumbLink>{title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>

        {actions && <div>{actions}</div>}
      </div>
    </header>
  );
});
