import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { UsersOnWorkspaceType, WorkspaceType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { UsersOnWorkspace, Workspace } from './models';

export const WorkspaceStore: IAnyStateTreeNode = types
  .model({
    workspace: types.union(Workspace, types.undefined),
    usersOnWorkspaces: types.array(UsersOnWorkspace),
  })
  .actions((self) => {
    const update = (workspace: WorkspaceType) => {
      self.workspace = workspace;
    };
    const updateUsers = (userRecord: UsersOnWorkspaceType, id: string) => {
      const indexToUpdate = self.usersOnWorkspaces.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.usersOnWorkspaces[indexToUpdate] = {
          ...self.usersOnWorkspaces[indexToUpdate],
          ...userRecord,
          // TODO fix array type mismatch
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.usersOnWorkspaces.push(userRecord);
      }
    };
    const deleteUser = (id: string) => {
      const indexToDelete = self.usersOnWorkspaces.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToDelete !== -1) {
        self.usersOnWorkspaces.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* (workspaceId: string) {
      self.workspace = yield tegonDatabase.workspaces.get({
        id: workspaceId,
      });

      self.usersOnWorkspaces = yield tegonDatabase.usersOnWorkspaces
        .where({
          workspaceId,
        })
        .toArray();
    });

    return { update, updateUsers, deleteUser, load };
  })
  .views((self) => ({
    getUserData(userId: string) {
      return self.usersOnWorkspaces.find(
        (uOW: UsersOnWorkspaceType) => uOW.userId === userId,
      );
    },
  }));

export type WorkspaceStoreType = Instance<typeof WorkspaceStore>;
