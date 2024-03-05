/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { UseQueryResult, useQuery } from 'react-query';

import { XHRErrorResponse, ajaxPost } from 'common/lib/ajax';

import { User } from 'store/user-context';

/**
 * Query Key for Get user.
 */
export const GetUserQuery = 'getUserQuery';

export function getUsers(userIds: string[]) {
  return ajaxPost({
    url: '/api/v1/users',
    data: {
      userIds,
    },
  });
}

export function useGetUsersQuery(
  userIds: string[],
): UseQueryResult<User[], XHRErrorResponse> {
  return useQuery([GetUserQuery, userIds], () => getUsers(userIds), {
    retry: 1,
    staleTime: 1,
    refetchOnWindowFocus: false, // Frequency of Change would be Low
  });
}
