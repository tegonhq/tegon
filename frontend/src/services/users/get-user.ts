/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { UseQueryResult, useQuery } from 'react-query';

import { XHRErrorResponse, ajaxGet } from 'lib/ajax';

import { User } from 'store/user-context';

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
    staleTime: 1,
    refetchOnWindowFocus: false, // Frequency of Change would be Low
  });
}
