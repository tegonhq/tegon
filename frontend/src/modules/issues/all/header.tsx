/** Copyright (c) 2024, Tegon, all rights reserved. **/

/** Copyright (c) 2024, Tegon, all rights reserved. **/

import Link from 'next/link';
import { useRouter } from 'next/router';

import { getTeamColor } from 'common/color-utils';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from 'components/ui/breadcrumb';
import { useCurrentTeam } from 'hooks/teams';
import { TeamLine } from 'icons';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const team = useCurrentTeam();
  const {
    query: { workspaceSlug },
  } = useRouter();
  return (
    <header className="flex pl-8 px-4 py-3 w-full border-b justify-between items-center">
      <Breadcrumb className="text-xs">
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            className="flex items-center gap-2 font-medium"
            href={`/${workspaceSlug}/team/${team.identifier}/all`}
          >
            <div
              className={`p-[2px] w-5 h-5 ${getTeamColor(team.name, true)} rounded-sm`}
            >
              <TeamLine
                size={16}
                className={`shrink-0 h-4 w-4 ${getTeamColor(team.name)}`}
              />
            </div>

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
}
