/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IssueHistoryType } from 'common/types/issue';

import { useIssueHistoryStore } from './use-issue-history-store';

export function useIssueHistory(issueId: string) {
  const { issueHistories } = useIssueHistoryStore();

  return issueHistories.filter(
    (issueHistory: IssueHistoryType) => issueHistory.issueId === issueId,
  );
}
