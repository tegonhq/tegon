import { types } from 'mobx-state-tree';

export const Workspace = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  name: types.string,
  slug: types.string,
  preferences: types.union(types.model({}), types.undefined, types.null),
});

export const UsersOnWorkspace = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  userId: types.string,
  workspaceId: types.string,
  role: types.enumeration(['ADMIN', 'USER', 'BOT', 'AGENT']),
  status: types.union(
    types.undefined,
    types.enumeration(['INVITED', 'ACTIVE', 'SUSPENDED']),
  ),
  teamIds: types.array(types.string),
  settings: types.union(
    types.model({
      ai: types.union(types.undefined, types.boolean),
    }),
    types.null,
    types.undefined,
  ),
});
