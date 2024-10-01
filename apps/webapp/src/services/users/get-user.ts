import { type UseQueryResult, useQuery } from 'react-query';

import type { User } from 'common/types';

import { type XHRErrorResponse, ajaxGet } from 'services/utils';

/**
 * Query Key for Get user.
 */
export const GetUserQuery = 'getUserQuery';

export function getUser() {
  return ajaxGet({
    url: '/api/v1/users',
  });
}

export function useGetUserQuery(): UseQueryResult<User, XHRErrorResponse> {
  return useQuery([GetUserQuery], () => getUser(), {
    retry: 1,
    staleTime: Infinity,
    refetchOnWindowFocus: false, // Frequency of Change would be Low
  });
}
