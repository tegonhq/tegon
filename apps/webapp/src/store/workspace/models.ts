import { PriorityType } from '@tegonhq/types';
import { types } from 'mobx-state-tree';

export const Workspace = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  name: types.string,
  slug: types.string,
  preferences: types.union(
    types.model({
      priorityType: types.union(
        types.enumeration([
          PriorityType.DescriptivePriority,
          PriorityType.ShorthandPriority,
        ]),
        types.undefined,
        types.null,
      ),
    }),
    types.undefined,
    types.null,
  ),
});

export const UsersOnWorkspace = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  userId: types.string,
  workspaceId: types.string,
  role: types.enumeration(['ADMIN', 'USER', 'BOT', 'AGENT']),
  teamIds: types.array(types.string),
  settings: types.union(
    types.model({
      ai: types.union(types.undefined, types.boolean),
    }),
    types.null,
    types.undefined,
  ),
});
