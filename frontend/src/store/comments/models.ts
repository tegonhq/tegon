/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { types } from 'mobx-state-tree';

export const Comment = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  userId: types.string,
  issueId: types.string,
  body: types.union(types.string, types.undefined),
  parentId: types.union(types.string, types.null, types.undefined),
});

export const CommentArray = types.array(Comment);
