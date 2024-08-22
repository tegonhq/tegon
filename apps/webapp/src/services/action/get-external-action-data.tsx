import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from 'services/utils';
import type { ActionSource } from './get-all-actions';

/**
 * Query Key for Get user.
 */
const GetExternalActionData = 'getExternalActionData';

export function getExternalActionData(actionSlug: string) {
  return ajaxGet({
    url: `/api/v1/action/source/${actionSlug}`,
  });
}

export function useGetExternalActionDataQuery(
  actionSlug: string,
): UseQueryResult<ActionSource, XHRErrorResponse> {
  return useQuery(
    [GetExternalActionData],
    () => getExternalActionData(actionSlug),
    {
      retry: 1,
      staleTime: 1,
      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
