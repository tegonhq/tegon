/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';

import { useContextStore } from 'store/global-context-provider';

export function useIssueData() {
  const {
    query: { issueId },
  } = useRouter();

  const { issuesStore } = useContextStore();

  return issuesStore.getIssueByNumber(issueId);
}
