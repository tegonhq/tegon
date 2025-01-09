import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { buttonVariants } from '@tegonhq/ui/components/button';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { AddLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { HeaderLayout } from 'common/header-layout';

import { useCurrentTeam } from 'hooks/teams';

interface HeaderProps {
  title: string;
}

export const Header = observer(({ title }: HeaderProps) => {
  const team = useCurrentTeam();

  const {
    query: { workspaceSlug },
  } = useRouter();

  const actions = (
    <div>
      <Link
        className={cn(
          buttonVariants({ variant: 'link' }),
          'flex items-center justify-start my-2 w-full gap-2 bg-grayAlpha-100 rounded-sm px-2 py-1',
        )}
        href={`/${workspaceSlug}/settings/new_team`}
      >
        <AddLine size={14} />
        Create Team
      </Link>
    </div>
  );

  return (
    <HeaderLayout actions={actions}>
      <Breadcrumb>
        {team && (
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
        )}
        <BreadcrumbItem>
          <BreadcrumbLink>{title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </HeaderLayout>
  );
});
