/** Copyright (c) 2024, Tegon, all rights reserved. **/

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

export function Header({ title }: HeaderProps) {
  const team = useCurrentTeam();

  return (
    <header className="flex px-4 py-3.5 w-full border-b justify-between items-center">
      <div className="flex gap-4 items-center text-sm">
        <Breadcrumb className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink className="flex items-center gap-2 font-medium">
              <TeamIcon name={team.name} />

              <span className="inline-block"> {title}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </header>
  );
}
