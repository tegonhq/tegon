import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';

import { useCurrentTeam } from 'hooks/teams';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const team = useCurrentTeam();

  return (
    <header className="flex px-6 py-4 w-full items-center gap-2">
      <div className="flex gap-4 items-center">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink className="flex items-center gap-2">
              <TeamIcon name={team.name} />

              <span className="inline-block"> {title}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </header>
  );
}
