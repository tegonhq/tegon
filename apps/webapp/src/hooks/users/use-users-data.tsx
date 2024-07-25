import * as React from 'react';

import type { UsersOnWorkspaceType } from 'common/types/workspace';

import { useTeamWithId } from 'hooks/teams';

import { useGetUsersQuery } from 'services/users/get-users';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

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

export function useUserData(
  userId: string,
  teamId?: string,
): {
  isLoading: boolean;
  userData: User | undefined;
} {
  const team = useTeamWithId(teamId);

  const { workspaceStore } = useContextStore();
  const usersOnWorkspace = workspaceStore.usersOnWorkspaces;

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUsersQuery([
    usersOnWorkspace.find((uOW: UsersOnWorkspaceType) => {
      if (team?.id) {
        return uOW.teamIds.includes(team.id) && uOW.userId === userId;
      }

      return uOW.userId === userId;
    }).userId,
  ]);

  React.useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceStore]);

  return { isLoading, userData: usersData ? usersData[0] : undefined };
}
