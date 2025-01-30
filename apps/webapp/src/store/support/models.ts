import { types } from 'mobx-state-tree';

export const Support = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,

  reportedById: types.union(types.null, types.string),
  actualFrtAt: types.union(types.null, types.string),
  firstResponseAt: types.union(types.null, types.string),
  nextResponseAt: types.union(types.null, types.string),
  resolvedAt: types.union(types.null, types.string),
  slaDueBy: types.union(types.null, types.string),

  metadata: types.union(types.null, types.string),
  issueId: types.string,
});
