import { types } from 'mobx-state-tree';

export const IntegrationDefinition = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  name: types.string,
  scopes: types.union(types.string, types.undefined),
  workspaceId: types.string,
});
