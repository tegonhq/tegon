import type { IssueType } from '@tegonhq/types';

import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from '@tegonhq/services/utils';

/**
 * Query Key for Searching Issues.
 */
export const SimilarIssuesQuery = 'similarIssuesQuery';

export interface SimilarIssuesParams {
  workspaceId: string;
  issueId: string;
  limit?: number;
}

export function similarIssues(data: SimilarIssuesParams) {
  return ajaxGet({
    url: `/api/v1/search/similar_issues`,
    query: {
      limit: 3,
      ...data,
    },
  });
}

export function useGetSimilarIssuesQuery(
  data: SimilarIssuesParams,
  enabled = false,
): UseQueryResult<IssueType[], XHRErrorResponse> {
  return useQuery(
    [SimilarIssuesQuery, data.issueId],
    () => similarIssues(data),
    {
      retry: 1,
      staleTime: 1,
      refetchOnWindowFocus: false, // Frequency of Change would be Low
      enabled,
    },
  );
}
