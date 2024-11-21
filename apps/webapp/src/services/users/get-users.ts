import { type UseQueryResult, useQuery } from 'react-query';

import type { User, UsersOnWorkspaceType } from 'common/types';

import { type XHRErrorResponse, ajaxGet } from 'services/utils';

import { useContextStore } from 'store/global-context-provider';

/**
 * Query Key for Get user.
 */
const GetUsersQuery = 'getUsersQuery';

export function getUsers(userIds: string[]) {
  return ajaxGet({
    url: '/api/v1/users',
    query: {
      userIds: userIds.join(','),
    },
  });
}

export function useGetUsersQuery(): UseQueryResult<User[], XHRErrorResponse> {
  const { workspaceStore } = useContextStore();

  const usersOnWorkspace = workspaceStore.usersOnWorkspaces;

  return useQuery(
    [GetUsersQuery, usersOnWorkspace],
    () =>
      getUsers(usersOnWorkspace.map((uOW: UsersOnWorkspaceType) => uOW.userId)),
    {
      retry: 1,
      staleTime: 1000000,
      refetchOnWindowFocus: false, // Frequency of Change would be Low
    },
  );
}
