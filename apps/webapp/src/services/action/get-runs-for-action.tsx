import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxGet } from 'services/utils';

/**
 * Query Key for Get user.
 */
const GetRunsForAction = 'getRunsForAction';

export function getRunsForAction(slug: string) {
  return ajaxGet({
    url: `/api/v1/action/${slug}/runs`,
  });
}

export function useGetRunsForActionQuery(
  slug: string,
  // TODO (harshith): add types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): UseQueryResult<any, XHRErrorResponse> {
  return useQuery([GetRunsForAction], () => getRunsForAction(slug), {
    retry: 1,
    staleTime: 1,
    refetchOnWindowFocus: false, // Frequency of Change would be Low
  });
}
