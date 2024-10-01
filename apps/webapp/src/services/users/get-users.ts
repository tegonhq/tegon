import { type UseQueryResult, useQuery } from 'react-query';

import type { User } from 'common/types';

import { type XHRErrorResponse, ajaxPost } from 'services/utils';

/**
 * Query Key for Get user.
 */
const GetUsersQuery = 'getUsersQuery';

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
  return useQuery([GetUsersQuery, userIds], () => getUsers(userIds), {
    retry: 1,
    staleTime: Infinity,
    refetchOnWindowFocus: false, // Frequency of Change would be Low
  });
}
