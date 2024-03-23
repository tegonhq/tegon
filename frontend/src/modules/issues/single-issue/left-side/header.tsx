/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiAccountBoxFill } from '@remixicon/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from 'components/ui/breadcrumb';
import { useCurrentTeam } from 'hooks/teams';

interface HeaderProps {
  backURL?: string;
}

export function Header({ backURL }: HeaderProps) {
  const team = useCurrentTeam();

  const {
    query: { issueId, workspaceSlug },
  } = useRouter();

  return (
    <header className="flex pl-8 px-4 py-4 w-full border-b justify-between items-center">
      <div>
        <Breadcrumb className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              className="flex items-center gap-2"
              href={
                backURL
                  ? backURL
                  : `/${workspaceSlug}/team/${team.identifier}/all`
              }
            >
              <RiAccountBoxFill
                size={14}
                className="shrink-0 text-muted-foreground h-4 w-4"
              />
              <span className="inline-block">{team.name}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              href="/docs/primitives/accordion"
              className="font-medium"
            >
              {issueId}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </header>
  );
}
