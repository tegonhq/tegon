import { type UseQueryResult, useQuery } from 'react-query';

import type { ActionType } from 'common/types';

import { type XHRErrorResponse, ajaxGet } from 'services/utils';

/**
 * Query Key for Get user.
 */
export const GetRunsForAction = 'getRunsForAction';

export interface TriggerRun {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  finishedAt: string;
  startedAt: string;
  action?: ActionType;
}

export function getRunsForAction(slug: string, workspaceId: string) {
  return ajaxGet({
    url: `/api/v1/action/${slug}/runs?workspaceId=${workspaceId}`,
  });
}

export function useGetRunsForActionQuery(
  slug: string,
  workspaceId: string,
): UseQueryResult<{ data: TriggerRun[] }, XHRErrorResponse> {
  return useQuery(
    [GetRunsForAction, slug],
    () => getRunsForAction(slug, workspaceId),
    {
      retry: 1,
      staleTime: 1,
      refetchInterval: 5000,
      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
