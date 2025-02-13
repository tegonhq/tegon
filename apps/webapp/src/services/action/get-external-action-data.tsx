import type { ActionConfig } from '@tegonhq/types';

import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from 'services/utils';

/**
 * Query Key for Get user.
 */
const GetExternalActionData = 'getExternalActionData';

export function getExternalActionData(actionSlug: string) {
  return ajaxGet({
    url: `/api/v1/action/external/${actionSlug}`,
  });
}

export function useGetExternalActionDataQuery(
  actionSlug: string,
): UseQueryResult<ActionConfig, XHRErrorResponse> {
  return useQuery(
    [GetExternalActionData, actionSlug],
    () => getExternalActionData(actionSlug),
    {
      retry: 1,
      staleTime: 10000,
      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
