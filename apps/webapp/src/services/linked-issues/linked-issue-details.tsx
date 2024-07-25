import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from 'common/lib/ajax';

export const GetLinkedIssueDetailsQuery = 'getLinkedIssueDetailsQuery';

interface LinkedIssueDetails {
  status: string;
  events: string;
  lastSeen: string;
  seenByUser: boolean;
  priority: string;
}

export function getLinkedIssueDetails(linkedIssueId: string) {
  return ajaxGet({
    url: `/api/v1/linked_issues/${linkedIssueId}/details`,
  });
}

export function useGetLinkedIssueDetailsQuery(
  linkedIssueId: string,
): UseQueryResult<LinkedIssueDetails, XHRErrorResponse> {
  return useQuery(
    [GetLinkedIssueDetailsQuery, linkedIssueId],
    () => getLinkedIssueDetails(linkedIssueId),
    {
      retry: 1,
      staleTime: 1,
      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
