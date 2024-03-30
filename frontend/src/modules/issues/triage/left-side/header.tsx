/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { TeamLine } from 'icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from 'components/ui/breadcrumb';
import { useCurrentTeam } from 'hooks/teams';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const team = useCurrentTeam();
  const {
    query: { workspaceSlug },
  } = useRouter();
  return (
    <header className="flex px-4 py-3.5 w-full border-b justify-between items-center">
      <div className="flex gap-4 items-center text-sm">
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

              <span className="inline-block"> {title}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </header>
  );
}
