import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from 'common/lib/ajax';
import type { IssueType } from 'common/types/issue';

/**
 * Query Key for Searching Issues.
 */
export const DuplicateIssuesQuery = 'duplicateIssuesQuery';

export interface DuplicateIssuesParams {
  workspaceId: string;
  query: string;
  limit?: number;
  threshold?: number;
}

export function duplicateIssues(data: DuplicateIssuesParams) {
  return ajaxGet({
    url: `/api/v1/search`,
    query: {
      limit: 3,
      threshold: 0.1,
      ...data,
    },
  });
}

export function useGetDuplicateIssuesQuery(
  data: DuplicateIssuesParams,
  enabled = false,
): UseQueryResult<IssueType[], XHRErrorResponse> {
  return useQuery(
    [DuplicateIssuesQuery, data.query],
    () => duplicateIssues(data),
    {
      retry: 1,
      staleTime: 1,
      refetchOnWindowFocus: false, // Frequency of Change would be Low
      enabled,
    },
  );
}
