import { RiAddLine, RiSearch2Line } from '@remixicon/react';
import {
  IssuesLine,
  LabelLine,
  StackLine,
  TeamLine,
  TriageLine,
} from '@tegonhq/ui/icons/index';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { type Option } from '../dialogs/common-dialog';

interface CommandNavigatorProps {
  setDialogState: (state: string) => void;
  onClose: () => void;
}

export const ID_MAP = {
  CREATE_ISSUE: 'create-issue',
  CREATE_LABEL: 'create-label',
  CREATE_VIEW: 'create-view',
  CREATE_NEW_TEAM: 'create-new-team',
  // Navigation
  GO_TRIAGE: 'go-triage',
  GO_ALL_ISSUES: 'go-all-issues',
  GO_VIEWS: 'go-all-views',

  // Search
  SEARCH: 'search',
};

export function useCommandNavigator({
  setDialogState,
  onClose,
}: CommandNavigatorProps) {
  const { applicationStore } = useContextStore();
  const { push } = useRouter();
  const { workspaceSlug } = useParams();
  const team = useCurrentTeam();

  const issues = React.useMemo(() => {
    if (applicationStore.hoverIssue) {
      return [applicationStore.hoverIssue];
    }

    return applicationStore.selectedIssues;
  }, [applicationStore.selectedIssues, applicationStore.hoverIssue]);

  const options = React.useMemo(() => {
    const options: Option[] = [
      {
        Icon: <RiAddLine className="!h-4 !w-4" />,
        text: 'Create issue',
        value: ID_MAP.CREATE_ISSUE,
        group: 'Create',
      },
      {
        Icon: <LabelLine className="!h-4 !w-4" />,
        text: 'Create label',
        value: ID_MAP.CREATE_LABEL,
        group: 'Create',
      },
      {
        Icon: <StackLine className="!h-4 !w-4" />,
        text: 'Create view',
        value: ID_MAP.CREATE_VIEW,
        group: 'Create',
      },
      {
        Icon: <TeamLine className="!h-4 !w-4" />,
        text: 'Create new team',
        value: ID_MAP.CREATE_NEW_TEAM,
        group: 'Create',
      },

      // Navigation
      {
        Icon: <TriageLine className="!h-4 !w-4" />,
        text: 'Go to triage issues',
        value: ID_MAP.GO_TRIAGE,
        group: 'Navigation',
      },
      {
        Icon: <IssuesLine className="!h-4 !w-4" />,
        text: 'Go to all issues',
        value: ID_MAP.GO_ALL_ISSUES,
        group: 'Navigation',
      },
      {
        Icon: <StackLine className="!h-4 !w-4" />,
        text: 'Go to views',
        value: ID_MAP.GO_VIEWS,
        group: 'Navigation',
      },

      // Search
      {
        Icon: <RiSearch2Line className="!h-4 !w-4" />,
        text: 'Search',
        value: ID_MAP.SEARCH,
        group: 'Search',
      },
    ];

    if (issues.length > 0) {
      // Add options related to the issues selected
    }

    return options;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issues]);

  const onSelect = (id: string) => {
    if (id === ID_MAP.CREATE_ISSUE) {
      setDialogState('newIssue');
    }

    if (id === ID_MAP.CREATE_LABEL) {
      push(`/${workspaceSlug}/settings/labels`);
    }

    if (id === ID_MAP.CREATE_VIEW) {
      push(`/${workspaceSlug}/team/${team.identifier}/all`);
    }

    if (id === ID_MAP.CREATE_NEW_TEAM) {
      push(`/${workspaceSlug}/team/settings/new_team`);
    }

    if (id === ID_MAP.GO_TRIAGE) {
      push(`/${workspaceSlug}/team/${team.identifier}/triage`);
    }

    if (id === ID_MAP.GO_ALL_ISSUES) {
      push(`/${workspaceSlug}/team/${team.identifier}/all`);
    }

    if (id === ID_MAP.GO_VIEWS) {
      push(`/${workspaceSlug}/team/${team.identifier}/views`);
    }

    if (id === ID_MAP.SEARCH) {
      setDialogState('search');
    }

    onClose();
  };

  return { options, onSelect };
}
