/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from 'common/lib/ajax';
import type { BootstrapResponse } from 'common/types/data-loader';

/**
 * Query Key for Get bootstrap records.
 */
export const GetBootstrapRecords = 'getBootstrapRecords';

export function getBootstrapRecords(
  workspaceId: string,
  modelNames: string[],
  userId: string,
) {
  return ajaxGet({
    url: `/api/v1/sync_actions/bootstrap`,
    query: {
      workspaceId,
      userId,
      modelNames: modelNames.join(','),
    },
  });
}

export interface QueryParams {
  workspaceId: string;
  userId: string;
  modelNames: string[];
  onSuccess?: (data: BootstrapResponse) => void;
}

export function useBootstrapRecords({
  workspaceId,
  userId,
  modelNames,
  onSuccess,
}: QueryParams): UseQueryResult<BootstrapResponse, XHRErrorResponse> {
  return useQuery(
    [GetBootstrapRecords, modelNames, workspaceId, userId],
    () => getBootstrapRecords(workspaceId, modelNames, userId),
    {
      retry: 1,
      staleTime: 1,
      enabled: false,
      onSuccess,

      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
