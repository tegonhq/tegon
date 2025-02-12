import { types } from 'mobx-state-tree';

export const Action = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,

  name: types.string,
  description: types.union(types.string, types.null),
  slug: types.string,
  config: types.string,
  version: types.string,
  integrations: types.array(types.string),

  isPersonal: types.boolean,

  data: types.string,
  status: types.enumeration([
    'DEPLOYING',
    'ERRORED',
    'INSTALLED',
    'NEEDS_CONFIGURATION',
    'ACTIVE',
    'SUSPENDED',
  ]),

  workspaceId: types.string,

  createdById: types.string,
});

export const ActionsArray = types.array(Action);
