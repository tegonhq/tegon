import { useRouter } from 'next/router';
import React from 'react';

import type { IssueType } from 'common/types';

import { IssueViewContext } from 'components/side-issue-view';
import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

export function useIssueData(): IssueType {
  const { issue } = React.useContext(IssueDataContext);

  return issue;
}

export function useIssueDataFromStore(sideView?: boolean): IssueType {
  const {
    query: { issueId },
  } = useRouter();
  const { issueId: viewIssueId } = React.useContext(IssueViewContext);

  const { issuesStore } = useContextStore();
  const team = useCurrentTeam();

  return sideView
    ? issuesStore.getIssueByIdWithChildren(viewIssueId)
    : issuesStore.getIssueByNumber(issueId, team?.id);
}

interface ContextType {
  issue: IssueType;
}

export const IssueDataContext = React.createContext<ContextType>(undefined);
