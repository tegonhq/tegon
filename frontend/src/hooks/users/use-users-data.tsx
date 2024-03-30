/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import type { UsersOnWorkspaceType } from 'common/types/workspace';

import { useCurrentTeam } from 'hooks/teams';

import { useGetUsersQuery } from 'services/users/get-users';

import { useContextStore } from 'store/global-context-provider';

export function useUsersData(teamId?: string) {
  const { workspaceStore } = useContextStore();
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

export function useUserData(userId: string) {
  const currentTeam = useCurrentTeam();

  const { workspaceStore } = useContextStore();
  const usersOnWorkspace = workspaceStore.usersOnWorkspaces;
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUsersQuery([
    usersOnWorkspace.find((uOW: UsersOnWorkspaceType) => {
      if (currentTeam.id) {
        return uOW.teamIds.includes(currentTeam.id) && uOW.userId === userId;
      }

      return uOW.userId === userId;
    }).userId,
  ]);

  React.useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceStore]);

  return { isLoading, userData: usersData[0] };
}
