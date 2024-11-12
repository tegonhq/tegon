import { types } from 'mobx-state-tree';

export const Cycle = types.model('Cycle', {
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,

  name: types.string,
  description: types.union(types.string, types.null),
  number: types.union(types.string, types.null, types.undefined),
  teamId: types.string,
  startDate: types.union(types.string, types.null),
  endDate: types.union(types.string, types.null),

  preferences: types.union(types.string, types.null),
});

export const Cycles = types.array(Cycle);
