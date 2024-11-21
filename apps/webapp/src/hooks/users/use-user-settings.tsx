import React from 'react';

import type { UsersOnWorkspaceType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';
import { UserContext } from 'store/user-context';

export const useUserSettings = () => {
  const user = React.useContext(UserContext);
  const { workspaceStore } = useContextStore();
  const userOnWorkspace = workspaceStore.usersOnWorkspaces.find(
    (uOW: UsersOnWorkspaceType) => uOW.userId === user.id,
  );

  return userOnWorkspace.settings;
};
