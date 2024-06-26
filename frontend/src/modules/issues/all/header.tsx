/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from 'components/ui/breadcrumb';
import { TeamIcon } from 'components/ui/team-icon';
import { useCurrentTeam } from 'hooks/teams';

interface HeaderProps {
  title: string;
}

export const Header = observer(({ title }: HeaderProps) => {
  const team = useCurrentTeam();

  const {
    query: { workspaceSlug },
  } = useRouter();

  return (
    <header className="flex px-6 py-4 w-full items-center gap-2">
      <Breadcrumb>
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
        <BreadcrumbItem>
          <BreadcrumbLink>{title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </header>
  );
});
