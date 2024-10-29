import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@tegonhq/ui/components/breadcrumb';
import { Button } from '@tegonhq/ui/components/button';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { CheckLine, CrossLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { SidebarExpand } from 'common/sidebar-expand';

import { useScope } from 'hooks';
import { useCurrentTeam } from 'hooks/teams';

import { IssueOptionsDropdown } from './issue-actions/issue-options-dropdown';
import { TriageAcceptModal } from './triage-view/triage-accept-modal';
import { TriageDeclineModal } from './triage-view/triage-decline-modal';
import { TRIAGE_LOCAL_SCOPE, useTriageShortcuts } from './use-triage-shortcuts';

interface HeaderProps {
  isTriageView?: boolean;
}

export const Header = observer(({ isTriageView = false }: HeaderProps) => {
  useScope(TRIAGE_LOCAL_SCOPE);
  const team = useCurrentTeam();
  const [triageAction, setTriageAction] = React.useState<
    'Accept' | 'Decline' | 'Duplicate'
  >(undefined);

  const {
    query: { issueId, workspaceSlug },
  } = useRouter();

  const onClose = (value: boolean) => {
    if (!value) {
      setTriageAction(undefined);
    }
  };

  const chooseTriageAction = (action: 'Accept' | 'Decline') => {
    setTriageAction(action);
  };

  // Define the Accept action
  const acceptTriage = () => {
    chooseTriageAction('Accept');
    // Add your accept logic here (e.g., API call, state update)
  };

  // Define the Decline action
  const declineTriage = () => {
    chooseTriageAction('Decline');
    // Add your decline logic here (e.g., API call, state update)
  };

  // Use the keyboard shortcuts hook for Accept (A) and Decline (D)
  useTriageShortcuts({ onAccept: acceptTriage, onDecline: declineTriage });

  return (
    <header className="flex px-6 w-full gap-2 justify-between items-center">
      <div className="flex gap-2 py-3 items-center">
        <SidebarExpand />
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
        <div className="flex justify-end gap-3 py-2">
          <Button
            variant="secondary"
            onClick={() => chooseTriageAction('Accept')}
          >
            <CheckLine size={14} className="mr-2" />
            Accept
          </Button>

          <Button
            variant="secondary"
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
