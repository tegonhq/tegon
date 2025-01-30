import { types } from 'mobx-state-tree';

export const People = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,

  name: types.string,
  email: types.string,

  phone: types.union(types.null, types.string),
  companyId: types.union(types.null, types.string),

  metadata: types.union(types.null, types.string),
  workspaceId: types.string,
});
