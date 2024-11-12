import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { Button } from '@tegonhq/ui/components/button';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { DocumentLine, IssuesLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { HeaderLayout } from 'common/header-layout';
import { SidebarExpand } from 'common/sidebar-expand';

import { useCurrentTeam } from 'hooks/teams';

export type CycleTabs = 'overview' | 'issues';

interface HeaderProps {
  title?: string;
  isCycleView?: boolean;
  view?: string;
  setView?: (view: CycleTabs) => void;
}

export const Header = observer(
  ({ title, isCycleView, view, setView }: HeaderProps) => {
    const { query } = useRouter();
    const team = useCurrentTeam();

    return (
      <HeaderLayout>
        <SidebarExpand />
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              className="flex items-center gap-2"
              href={`${query.workspaceSlug}/team/${team.identifier}/cycles`}
            >
              <TeamIcon name={team.name} />

              <span className="inline-block">{team.name}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {title && (
            <BreadcrumbItem>
              <BreadcrumbLink>{title}</BreadcrumbLink>
            </BreadcrumbItem>
          )}

          {isCycleView && (
            <div className="flex items-center ml-2 gap-1">
              <Button
                variant="secondary"
                className="gap-1"
                isActive={view === 'overview'}
                onClick={() => setView('overview')}
              >
                <DocumentLine />
                Overview
              </Button>
              <Button
                variant="secondary"
                className="gap-1"
                isActive={view === 'issues'}
                onClick={() => setView('issues')}
              >
                <IssuesLine />
                Issues
              </Button>
            </div>
          )}
        </Breadcrumb>
      </HeaderLayout>
    );
  },
);
