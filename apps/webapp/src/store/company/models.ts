import { types } from 'mobx-state-tree';

export const Company = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,

  name: types.string,

  domain: types.union(types.null, types.string),
  website: types.union(types.null, types.string),
  description: types.union(types.null, types.string),
  logo: types.union(types.null, types.string),
  industry: types.union(types.null, types.string),
  size: types.union(types.null, types.string),
  type: types.union(types.null, types.string),

  metadata: types.union(types.null, types.string),
  workspaceId: types.string,
});
