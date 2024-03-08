/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import type { UsersOnWorkspaceType } from 'common/types/workspace';

import { useWorkspaceStore } from 'hooks/workspace';

import { useGetUsersQuery } from 'services/users/get-users';

export function useUsersData(teamId?: string) {
  const workspaceStore = useWorkspaceStore();
  const usersOnWorkspace = workspaceStore.usersOnWorkspaces;
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUsersQuery(
    usersOnWorkspace
      .filter((uOW: UsersOnWorkspaceType) => {
        if (teamId) {
          return uOW.teamIds.includes(teamId);
        }

        return true;
      })
      .map((uOW: UsersOnWorkspaceType) => uOW.userId),
  );

  React.useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceStore]);

  return { isLoading, usersData };
}
