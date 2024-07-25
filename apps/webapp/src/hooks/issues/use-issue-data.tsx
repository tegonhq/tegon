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
