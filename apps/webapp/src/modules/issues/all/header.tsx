import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { SidebarExpand } from 'common/sidebar-expand';
import type { TeamType } from 'common/types';

interface HeaderProps {
  title: string;
  team?: TeamType;
}

export const Header = observer(({ title, team }: HeaderProps) => {
  const {
    query: { workspaceSlug },
  } = useRouter();

  return (
    <header className="flex px-6 w-full items-center gap-2">
      <div className="flex gap-2 py-3 items-center">
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
    </header>
  );
});
