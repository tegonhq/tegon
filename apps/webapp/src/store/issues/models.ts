import { types } from 'mobx-state-tree';

export const Issue = types.model('Issue', {
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  title: types.string,
  number: types.number,
  description: types.union(types.string, types.null),
  priority: types.union(types.number, types.null),
  dueDate: types.union(types.string, types.null),
  sortOrder: types.union(types.number, types.null),
  estimate: types.union(types.number, types.null),
  teamId: types.string,
  createdById: types.union(types.string, types.null),
  assigneeId: types.union(types.string, types.null),
  labelIds: types.array(types.string),
  parentId: types.union(types.string, types.null),
  stateId: types.string,
  subscriberIds: types.array(types.string),
  cycleId: types.union(types.string, types.null, types.undefined),
  projectId: types.union(types.string, types.null, types.undefined),
  projectMilestoneId: types.union(types.string, types.null, types.undefined),
  sourceMetadata: types.union(types.string, types.null, types.undefined),
});

export const IssuesMap = types.map(Issue);
