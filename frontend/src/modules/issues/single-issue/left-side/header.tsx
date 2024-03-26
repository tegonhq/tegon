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

export function Header() {
  const team = useCurrentTeam();

  const {
    query: { issueId, workspaceSlug },
  } = useRouter();

  return (
    <header className="flex pl-8 px-4 py-3 w-full border-b justify-between items-center">
      <div>
        <Breadcrumb className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              className="flex items-center gap-2 font-medium"
              href={`/${workspaceSlug}/team/${team.identifier}/all`}
            >
              <div className="p-[2px] w-5 h-5 bg-red-400/10 rounded-sm">
                <TeamLine
                  size={14}
                  className="shrink-0 text-muted-foreground h-4 w-4 text-red-400"
                />
              </div>

              <span className="inline-block">{team.name}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              href="/docs/primitives/accordion"
              className="text-muted-foreground"
            >
              {issueId}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </header>
  );
}
