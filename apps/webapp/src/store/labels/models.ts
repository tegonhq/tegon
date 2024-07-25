import { types } from 'mobx-state-tree';

export const Label = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  name: types.string,
  color: types.string,
  workspaceId: types.string,

  description: types.union(types.null, types.string),
  teamId: types.union(types.null, types.string),
  groupId: types.union(types.null, types.string),
});
