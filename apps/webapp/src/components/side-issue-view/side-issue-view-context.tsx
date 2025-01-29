import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';

import { useLocalCommonState } from 'hooks/use-local-state';
import { useCurrentWorkspace } from 'hooks/workspace';

import { useContextStore } from 'store/global-context-provider';

import { SideIssueView } from './side-issue-view';

type ViewType = 'view_screen' | 'side_view';

interface ContextType {
  issueId?: string;
  viewType: string;
  openIssue: (issueId: string, override?: boolean) => void;
  closeIssueView: () => void;
  setViewType: (viewType: ViewType) => void;
}

export const IssueViewContext = React.createContext<ContextType>(undefined);

export const IssueViewProvider = observer(
  ({ children }: { children: React.ReactNode }) => {
    const { issuesStore, teamsStore } = useContextStore();
    const workspace = useCurrentWorkspace();
    const { push } = useRouter();
    const [issueId, setIssueId] = React.useState<string | undefined>(undefined);
    const [viewType, setViewType] = useLocalCommonState(
      'view_type',
      'side_view',
    );

    const openIssue = (issueId: string, override?: boolean) => {
      const issue = issuesStore.getIssueById(issueId);
      const team = teamsStore.getTeamWithId(issue?.teamId);

      if (override) {
        push(`/${workspace.slug}/issue/${team.identifier}-${issue.number}`);
        return;
      }

      if (viewType === 'side_view') {
        setIssueId(issueId);
      } else {
        push(`/${workspace.slug}/issue/${team.identifier}-${issue.number}`);
      }
    };

    const closeIssueView = () => {
      setIssueId(undefined);
    };

    return (
      <IssueViewContext.Provider
        value={{ viewType, issueId, openIssue, closeIssueView, setViewType }}
      >
        {issueId && <SideIssueView />}
        {children}
      </IssueViewContext.Provider>
    );
  },
);
