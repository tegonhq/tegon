import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { buttonVariants } from '@tegonhq/ui/components/button';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
    <Link
      href={
        team
          ? `/${workspaceSlug}/team/${team?.identifier}/all`
          : `/${workspaceSlug}/all`
      }
      className={cn(buttonVariants({ variant: 'secondary' }))}
    >
      New view
    </Link>
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
              <TeamIcon preferences={team.preferences} name={team.name} />

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
