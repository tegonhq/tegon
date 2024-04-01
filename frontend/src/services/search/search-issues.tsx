/* Copyright (c) 2024, Tegon, all rights reserved. **/

import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from 'common/lib/ajax';
import type { IssueType } from 'common/types/issue';

/**
 * Query Key for Searching Issues.
 */
export const SearchIssuesQuery = 'searchUserQuery';

export interface SearchIssuesParams {
  workspaceId: string;
  query: string;
  limit?: number;
}

export function searchIssue(data: SearchIssuesParams) {
  return ajaxGet({
    url: `/api/v1/search`,
    query: {
      limit: 10,
      ...data,
    },
  });
}

export function useGetSearchIssuesQuery(
  data: SearchIssuesParams,
  enabled = false,
): UseQueryResult<IssueType[], XHRErrorResponse> {
  return useQuery([SearchIssuesQuery, data], () => searchIssue(data), {
    retry: 1,
    staleTime: 1,
    refetchOnWindowFocus: false, // Frequency of Change would be Low
    enabled,
  });
}
