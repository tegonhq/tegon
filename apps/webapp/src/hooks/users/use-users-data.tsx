import { RoleEnum } from '@tegonhq/types';
import * as React from 'react';

import type { User } from 'common/types';
import type { UsersOnWorkspaceType } from 'common/types';

import { useTeamWithId } from 'hooks/teams';

import { useGetUsersQuery } from 'services/users';

import { useContextStore } from 'store/global-context-provider';

export function useUsersData(bot = true, teamId?: string) {
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

  const users = React.useMemo(() => {
    if (usersData) {
      return usersData.filter((user) =>
        bot ? true : user.role !== RoleEnum.BOT,
      );
    }

    return [];
  }, [bot, usersData]);

  return {
    isLoading,
    users,
  };
}

export function useUserData(
  userId: string,
  teamId?: string,
): {
  isLoading: boolean;
  user: User | undefined;
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

  return { isLoading, user: usersData ? usersData[0] : undefined };
}
