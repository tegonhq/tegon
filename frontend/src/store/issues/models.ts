/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { types } from 'mobx-state-tree';

export const Issue = types.model('Issue', {
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  title: types.string,
  number: types.number,
  description: types.string,
  priority: types.number,
  dueDate: types.union(types.string, types.null),
  sortOrder: types.number,
  estimate: types.union(types.number, types.null),
  teamId: types.string,
  createdById: types.string,
  assigneeId: types.union(types.string, types.null),
  labelIds: types.array(types.string),
  parentId: types.union(types.string, types.null),
  stateId: types.string,
});

export const IssuesMap = types.map(Issue);
