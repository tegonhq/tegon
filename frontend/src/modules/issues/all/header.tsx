/** Copyright (c) 2024, Tegon, all rights reserved. **/

/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { getTeamColor } from 'common/color-utils';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from 'components/ui/breadcrumb';
import { Button } from 'components/ui/button';
import { useCurrentTeam } from 'hooks/teams';
import { SidebarLine, TeamLine } from 'icons';

import { useContextStore } from 'store/global-context-provider';
import { TeamIcon } from 'components/ui/team-icon';

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
    <header className="flex pl-8 px-4 py-3 w-full border-b items-center gap-2">
      {applicationStore.displaySettings.sidebarCollapsed && (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            applicationStore.updateDisplaySettings({ sidebarCollapsed: false });
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
          <BreadcrumbLink
            as={Link}
            href={`/${workspaceSlug}/team/${team.identifier}/triage`}
            className="text-muted-foreground"
          >
            {title}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </header>
  );
});
