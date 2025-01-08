import { types } from 'mobx-state-tree';

export const Team = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  name: types.string,

  identifier: types.string,
  workspaceId: types.string,
  currentCycle: types.union(types.number, types.null, types.undefined),
  preferences: types.model({
    cyclesEnabled: types.union(types.boolean, types.undefined, types.null),
  }),
});

export const Teams = types.array(Team);
