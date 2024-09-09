import { types } from 'mobx-state-tree';

export const Workspace = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  name: types.string,
  slug: types.string,
});

export const UsersOnWorkspace = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  userId: types.string,
  workspaceId: types.string,
  role: types.enumeration(['ADMIN', 'USER', 'BOT', 'AGENT']),
  teamIds: types.array(types.string),
});
