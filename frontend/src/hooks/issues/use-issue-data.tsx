/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';

import type { IssueType } from 'common/types/issue';

import { useContextStore } from 'store/global-context-provider';

export function useIssueData(): IssueType {
  const {
    query: { issueId },
  } = useRouter();

  const { issuesStore } = useContextStore();

  return issuesStore.getIssueByNumber(issueId);
}
