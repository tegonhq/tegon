import { RoleEnum } from '@tegonhq/types';
import * as React from 'react';

import type { User } from 'common/types';
import type { UsersOnWorkspaceType } from 'common/types';

import { useProject } from 'hooks/projects';
import { useCurrentTeam, useTeamWithId } from 'hooks/teams';

import { useGetUsersQuery } from 'services/users';

import { useContextStore } from 'store/global-context-provider';

export function useUsersData(bot = true, teamId?: string) {
  const { workspaceStore } = useContextStore();
  const currentTeam = useCurrentTeam();
  const teamWithId = useTeamWithId(teamId);
  const team = teamWithId ? teamWithId : currentTeam;
  const project = useProject();

  const usersOnWorkspace = workspaceStore.usersOnWorkspaces;
  const { data: usersData, isLoading } = useGetUsersQuery();

  const users = React.useMemo(() => {
    if (usersData) {
      return usersData.filter((user) => {
        const isBot = bot ? true : user.role !== RoleEnum.BOT;

        const uOW = usersOnWorkspace.find(
          (u: UsersOnWorkspaceType) => u.userId === user.id,
        );

        if (team?.id) {
          return uOW.teamIds.includes(team.id) && isBot;
        }
        if (project?.teams) {
          return (
            project.teams.some((teamId: string) =>
              uOW.teamIds.includes(teamId),
            ) && isBot
          );
        }

        return isBot;
      });
    }

    return [];
  }, [bot, usersData, usersOnWorkspace, team, project]);

  return {
    isLoading,
    users,
  };
}

export function useUserData(userId: string) {
  const { workspaceStore } = useContextStore();

  const usersOnWorkspace = workspaceStore.usersOnWorkspaces;
  const { data: usersData, isLoading } = useGetUsersQuery();

  const user = React.useMemo(() => {
    if (usersData) {
      return usersData.find((user) => {
        const uOW = usersOnWorkspace.find(
          (u: UsersOnWorkspaceType) => u.userId === user.id,
        );

        return uOW.userId === userId;
      });
    }

    return undefined;
  }, [usersData, usersOnWorkspace, userId]);

  return { isLoading, user };
}

export function useAllUsers(bot = true): {
  isLoading: boolean;
  users: User[];
} {
  const { workspaceStore } = useContextStore();

  const { data: usersData, isLoading, refetch } = useGetUsersQuery();

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
