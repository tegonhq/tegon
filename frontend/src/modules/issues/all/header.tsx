/** Copyright (c) 2024, Tegon, all rights reserved. **/

/** Copyright (c) 2024, Tegon, all rights reserved. **/

import Link from 'next/link';
import { useRouter } from 'next/router';

import { TeamLine } from 'icons';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from 'components/ui/breadcrumb';
import { useCurrentTeam } from 'hooks/teams';

import { DisplayPopover } from './display-popover';
import { FilterDropdown } from './filter-dropdown';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const team = useCurrentTeam();
  const {
    query: { workspaceSlug },
  } = useRouter();
  return (
    <header className="flex pl-8 px-4 py-4 w-full border-b justify-between items-center">
      <div className="flex gap-4 items-center">
        <Breadcrumb className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              className="flex items-center gap-2 font-medium"
              href={`/${workspaceSlug}/team/${team.identifier}/all`}
            >
              <div className="p-[2px] w-5 h-5 bg-red-400/10 rounded-sm">
                <TeamLine
                  size={16}
                  className="shrink-0 text-muted-foreground text-red-400"
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
        <FilterDropdown />
      </div>
      <div className="flex gap-4 items-center">
        <DisplayPopover />
      </div>
    </header>
  );
}
