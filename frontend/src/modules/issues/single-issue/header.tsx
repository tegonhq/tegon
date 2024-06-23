/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from 'components/ui/breadcrumb';
import { Button } from 'components/ui/button';
import { TeamIcon } from 'components/ui/team-icon';
import { useCurrentTeam } from 'hooks/teams';
import { CheckLine, CrossLine, SidebarLine } from 'icons';

import { useContextStore } from 'store/global-context-provider';

import { IssueOptionsDropdown } from './issue-actions/issue-options-dropdown';
import { TriageAcceptModal } from './triage-view/triage-accept-modal';
import { TriageDeclineModal } from './triage-view/triage-decline-modal';

interface HeaderProps {
  isTriageView?: boolean;
}

export const Header = observer(({ isTriageView = false }: HeaderProps) => {
  const team = useCurrentTeam();
  const [triageAction, setTriageAction] = React.useState<
    'Accept' | 'Decline' | 'Duplicate'
  >(undefined);
  const { applicationStore } = useContextStore();

  const {
    query: { issueId, workspaceSlug },
  } = useRouter();

  const onClose = (value: boolean) => {
    if (!value) {
      setTriageAction(undefined);
    }
  };

  const chooseTriageAction = (action: 'Accept' | 'Decline' | 'Duplicate') => {
    setTriageAction(action);
  };

  return (
    <header className="flex px-6 py-4 w-full gap-2 justify-between items-center">
      <div className="flex gap-2 items-center">
        {applicationStore.sidebarCollapsed && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              applicationStore.updateSideBar(false);
            }}
          >
            <SidebarLine size={20} />
          </Button>
        )}
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
            <BreadcrumbLink as={Link} href="/docs/primitives/accordion">
              {issueId}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        {!isTriageView && <IssueOptionsDropdown />}
      </div>
      {isTriageView && (
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => chooseTriageAction('Accept')}
          >
            <CheckLine size={14} className="mr-2" />
            Accept
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => chooseTriageAction('Decline')}
          >
            <CrossLine size={16} className="mr-1" />
            Decline
          </Button>
        </div>
      )}

      {triageAction === 'Accept' && (
        <TriageAcceptModal setDialogOpen={onClose} />
      )}
      {triageAction === 'Decline' && (
        <TriageDeclineModal setDialogOpen={onClose} />
      )}
    </header>
  );
});
