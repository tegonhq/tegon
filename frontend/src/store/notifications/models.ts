/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { types } from 'mobx-state-tree';

export const Notification = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,

  type: types.enumeration([
    'IssueAssigned',
    'IssueUnAssigned',
    'IssueStatusChanged',
    'IssuePriorityChanged',
    'IssueNewComment',
    'IssueBlocks',
  ]),
  userId: types.string,
  issueId: types.union(types.string, types.null),
  actionData: types.union(types.string, types.null),
  createdById: types.union(types.string, types.null),
  sourceMetadata: types.union(types.string, types.null),

  readAt: types.union(types.string, types.null),
  workspaceId: types.string,
});

export const Notifications = types.array(Notification);
