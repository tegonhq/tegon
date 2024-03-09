/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { types } from 'mobx-state-tree';

export const IssueHistory = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  userId: types.string,
  issueId: types.string,

  addedLabelIds: types.array(types.string),
  removedLabelIds: types.array(types.string),
  fromPriority: types.union(types.number, types.null),
  toPriority: types.union(types.number, types.null),
  fromStateId: types.union(types.string, types.null),
  toStateId: types.union(types.string, types.null),
  fromEstimate: types.union(types.number, types.null),
  toEstimate: types.union(types.number, types.null),
  fromAssigneeId: types.union(types.string, types.null),
  toAssigneeId: types.union(types.string, types.null),
  fromParentId: types.union(types.string, types.null),
  toParentId: types.union(types.string, types.null),
});
