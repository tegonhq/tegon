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

import { useCurrentTeam } from 'hooks/teams';

interface HeaderProps {
  title: string;
}

export const Header = observer(({ title }: HeaderProps) => {
  const {
    query: { workspaceSlug },
  } = useRouter();
  const team = useCurrentTeam();

  return (
    <header className="flex px-2 w-full items-center gap-2 border-b border-border">
      <div className="flex gap-2 py-2 items-center h-[38px]">
        <SidebarExpand />

        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              className="flex items-center gap-2"
              href={`/${workspaceSlug}/settings/overview`}
            >
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          {team && (
            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                className="flex items-center gap-2"
                href={`/${workspaceSlug}/team/${team.identifier}/all`}
              >
                <TeamIcon preferences={team.preferences} name={team.name} />

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
