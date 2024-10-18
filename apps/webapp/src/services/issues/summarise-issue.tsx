import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from 'services/utils';

/**
 * Query Key for Get user.
 */
export const SummarizeIssue = 'summarizeIssue';

export function getSummarizeIssue(issueId: string) {
  return ajaxGet({
    url: `/api/v1/issues/ai/${issueId}/summarize`,
  });
}

export function useSummarizeIssue(
  issueId: string,
): UseQueryResult<string[], XHRErrorResponse> {
  return useQuery([SummarizeIssue], () => getSummarizeIssue(issueId), {
    retry: 1,
    staleTime: 1,
    refetchOnWindowFocus: false, // Frequency of Change would be Low
  });
}
