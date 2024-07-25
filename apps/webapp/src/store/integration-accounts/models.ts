import { types } from 'mobx-state-tree';

export const IntegrationAccount = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  accountId: types.string,
  settings: types.string,
  integratedById: types.string,
  integrationDefinitionId: types.string,
  workspaceId: types.string,
});
