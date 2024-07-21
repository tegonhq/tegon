import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from 'common/lib/ajax';
import type { BootstrapResponse } from 'common/types/data-loader';

/**
 * Query Key for Get Delta records.
 */
export const GetDeltaRecords = 'getDeltaRecords';

export function getDeltaRecords(
  workspaceId: string,
  modelNames: string[],
  lastSequenceId: string,
  userId: string,
) {
  return ajaxGet({
    url: `/api/v1/sync_actions/delta`,
    query: {
      workspaceId,
      userId,
      modelNames: modelNames.join(','),
      lastSequenceId,
    },
  });
}

export interface QueryParams {
  workspaceId: string;
  userId: string;
  modelNames: string[];
  lastSequenceId: string;
  onSuccess?: (data: BootstrapResponse) => void;
}

export function useDeltaRecords({
  workspaceId,
  lastSequenceId,
  modelNames,
  userId,
  onSuccess,
}: QueryParams): UseQueryResult<BootstrapResponse, XHRErrorResponse> {
  return useQuery(
    [GetDeltaRecords, modelNames, lastSequenceId, workspaceId, userId],
    () => getDeltaRecords(workspaceId, modelNames, lastSequenceId, userId),
    {
      retry: 1,
      staleTime: 1,
      enabled: false,
      onSuccess,
      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
