import { types } from 'mobx-state-tree';

export const LinkedIssue = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,

  url: types.string,
  sourceId: types.union(types.string, types.null),
  sourceData: types.string,
  issueId: types.string,
  createdById: types.union(types.string, types.undefined, types.null),
});

export const LinkedIssueArray = types.array(LinkedIssue);
