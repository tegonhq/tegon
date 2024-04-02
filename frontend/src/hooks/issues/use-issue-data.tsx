/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';

import type { IssueType } from 'common/types/issue';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

export function useIssueData(): IssueType {
  const {
    query: { issueId },
  } = useRouter();

  const { issuesStore } = useContextStore();
  const team = useCurrentTeam();

  return issuesStore.getIssueByNumber(issueId, team.id);
}
