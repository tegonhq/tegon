import type { TriggerRun } from './get-runs-for-action';

import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from 'services/utils';

/**
 * Query Key for Get user.
 */
const GetRunForAction = 'getRunForAction';

export interface TriggerRunWithLogs extends TriggerRun {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  finishedAt: string;
  startedAt: string;
  payload: { event: string; type: string };
  logs?: string;
}

export function getRunForAction(
  slug: string,
  runId: string,
  workspaceId: string,
) {
  return ajaxGet({
    url: `/api/v1/action/${slug}/runs?runId=${runId}&workspaceId=${workspaceId}`,
  });
}

export function useGetRunForActionQuery(
  slug: string,
  runId: string,
  workspaceId: string,
): UseQueryResult<TriggerRunWithLogs, XHRErrorResponse> {
  return useQuery(
    [GetRunForAction, slug, runId],
    () => getRunForAction(slug, runId, workspaceId),
    {
      retry: 1,
      staleTime: 1,
      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
