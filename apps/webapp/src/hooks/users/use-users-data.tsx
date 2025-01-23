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
  const [users, setUsers] = React.useState([]);
  const currentTeam = useCurrentTeam();
  const teamWithId = useTeamWithId(teamId);
  const team = teamWithId ? teamWithId : currentTeam;
  const project = useProject();

  const { data: usersData, isLoading } = useGetUsersQuery();

  React.useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bot, usersData, team?.id, project?.teams]);

  const getUsers = () => {
    // Memoize the usersOnWorkspace map for O(1) lookup
    const usersOnWorkspaceMap = workspaceStore.usersOnWorkspaces.reduce(
      (acc: Record<string, UsersOnWorkspaceType>, u: UsersOnWorkspaceType) => {
        acc[u.userId] = u;
        return acc;
      },
      {} as Record<string, UsersOnWorkspaceType>,
    );

    if (!usersData) {
      return;
    }

    // Pre-calculate team IDs to check against
    const validTeamIds = new Set(project?.teams || (team?.id ? [team.id] : []));

    const users = usersData.filter((user) => {
      const isBot = bot ? true : user.role !== RoleEnum.BOT;
      if (!isBot) {
        return false;
      }

      const uOW = usersOnWorkspaceMap[user.id];
      if (!uOW) {
        return false;
      }

      // If no team or project filter, return all non-bot users
      if (!team?.id && !project?.teams) {
        return true;
      }

      // Check if user belongs to any of the valid teams
      return uOW.teamIds.some((id: string) => validTeamIds.has(id));
    });

    setUsers(users);
  };

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
