import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { HeaderLayout } from 'common/header-layout';
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
    <HeaderLayout actions={actions}>
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
    </HeaderLayout>
  );
});
