/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { UseQueryResult, useQuery } from 'react-query';

import { XHRErrorResponse, ajaxGet } from 'common/lib/ajax';
import { BootstrapResponse } from 'common/types/data-loader';

/**
 * Query Key for Get bootstrap records.
 */
export const GetBootstrapRecords = 'getBootstrapRecords';

export function getBootstrapRecords(workspaceId: string, modelName: string) {
  return ajaxGet({
    url: `/api/v1/sync_actions/bootstrap`,
    query: {
      workspaceId,
      modelName,
    },
  });
}

export interface QueryParams {
  workspaceId: string;
  modelName: string;
  onSuccess?: (data: BootstrapResponse) => void;
}

export function useBootstrapRecords({
  workspaceId,
  modelName,
  onSuccess,
}: QueryParams): UseQueryResult<BootstrapResponse, XHRErrorResponse> {
  return useQuery(
    [GetBootstrapRecords, modelName, workspaceId],
    () => getBootstrapRecords(workspaceId, modelName),
    {
      retry: 1,
      staleTime: 1,
      enabled: false,
      onSuccess,

      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
