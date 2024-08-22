import type { User } from 'common/types';

import { type UseQueryResult, useQuery } from 'react-query';

import { type XHRErrorResponse, ajaxPost } from 'services/utils';

/**
 * Query Key for Get user.
 */
const GetUserQuery = 'getUserQuery';

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
