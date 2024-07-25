import { types } from 'mobx-state-tree';

export const IssueRelation = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,

  type: types.enumeration([
    'BLOCKS',
    'BLOCKED',
    'RELATED',
    'DUPLICATE',
    'DUPLICATE_OF',
    'SIMILAR',
  ]),
  issueId: types.string,
  relatedIssueId: types.string,
  createdById: types.union(types.string, types.null),
});
