/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { UsersOnWorkspaceType } from 'common/types/workspace';

import { useWorkspaceStore } from 'hooks/workspace';

import { useGetUsersQuery } from 'services/users/get-users';

export function useUsersData() {
  const workspaceStore = useWorkspaceStore();
  const usersOnWorkspace = workspaceStore.usersOnWorkspaces;
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUsersQuery(
    usersOnWorkspace.map((uOW: UsersOnWorkspaceType) => uOW.userId),
  );

  React.useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceStore]);

  return { isLoading, usersData };
}
