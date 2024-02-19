/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { UseQueryResult, useQuery } from 'react-query';

import { XHRErrorResponse, ajaxGet } from 'common/lib/ajax';
import { BootstrapResponse } from 'common/types/data-loader';

/**
 * Query Key for Get Delta records.
 */
export const GetDeltaRecords = 'getDeltaRecords';

export function getDeltaRecords(
  workspaceId: string,
  modelName: string,
  lastSequenceId: number,
) {
  return ajaxGet({
    url: `/api/v1/sync_actions/delta`,
    query: {
      workspaceId,
      modelName,
      lastSequenceId,
    },
  });
}

export interface QueryParams {
  workspaceId: string;
  modelName: string;
  lastSequenceId: number;
  onSuccess?: (data: BootstrapResponse) => void;
}

export function useDeltaRecords({
  workspaceId,
  lastSequenceId,
  modelName,
  onSuccess,
}: QueryParams): UseQueryResult<BootstrapResponse, XHRErrorResponse> {
  return useQuery(
    [GetDeltaRecords, modelName, lastSequenceId, workspaceId],
    () => getDeltaRecords(workspaceId, modelName, lastSequenceId),
    {
      retry: 1,
      staleTime: 1,
      enabled: false,
      onSuccess,

      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
