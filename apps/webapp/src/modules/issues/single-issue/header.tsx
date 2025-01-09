import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { HeaderLayout } from 'common/header-layout';

import { useCurrentTeam } from 'hooks/teams';

import { IssueOptionsDropdown } from './issue-actions/issue-options-dropdown';

export const Header = observer(() => {
  const team = useCurrentTeam();

  const {
    query: { issueId, workspaceSlug },
  } = useRouter();

  return (
    <HeaderLayout>
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
          <BreadcrumbLink>{issueId}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <IssueOptionsDropdown />
    </HeaderLayout>
  );
});
