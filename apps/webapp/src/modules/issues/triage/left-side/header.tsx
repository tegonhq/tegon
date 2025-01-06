import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';

import { HeaderLayout } from 'common/header-layout';

import { useCurrentTeam } from 'hooks/teams';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const team = useCurrentTeam();

  return (
    <HeaderLayout>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink className="flex items-center gap-2">
            <TeamIcon name={team?.name} />

            <span className="inline-block"> {title}</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </HeaderLayout>
  );
}
