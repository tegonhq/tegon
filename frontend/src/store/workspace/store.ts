/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { type IAnyStateTreeNode, type Instance, types } from 'mobx-state-tree';

import type {
  UsersOnWorkspaceType,
  WorkspaceType,
} from 'common/types/workspace';

import { tegonDatabase } from 'store/database';
import { MODELS } from 'store/models';

import { UsersOnWorkspace, Workspace } from './models';

const modelName = MODELS.Workspace;

export const WorkspaceStore: IAnyStateTreeNode = types
  .model({
    workspace: types.union(Workspace, types.undefined),
    lastSequenceId: types.union(types.undefined, types.number),
    usersOnWorkspaces: types.array(UsersOnWorkspace),
  })
  .actions((self) => ({
    update(workspace: WorkspaceType) {
      self.workspace = workspace;
    },
    updateUsers(userRecord: UsersOnWorkspaceType, id: string) {
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
    },
    deleteUser(id: string) {
      const indexToDelete = self.usersOnWorkspaces.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToDelete !== -1) {
        self.usersOnWorkspaces.splice(indexToDelete, 1);
      }
    },
    updateLastSequenceId(lastSequenceId: number) {
      self.lastSequenceId = lastSequenceId;
    },
  }));

export type WorkspaceStoreType = Instance<typeof WorkspaceStore>;

export async function initialiseWorkspaceStore(workspaceId: string) {
  let _store = workspaceStore;

  if (!_store) {
    const workspace = await tegonDatabase.workspaces.get({
      id: workspaceId,
    });
    const lastSequenceData = await tegonDatabase.sequences.get({
      id: modelName,
    });
    const usersOnWorkspaces = await tegonDatabase.usersOnWorkspaces
      .where({
        workspaceId,
      })
      .toArray();

    _store = WorkspaceStore.create({
      workspace,
      lastSequenceId: lastSequenceData?.lastSequenceId,
      usersOnWorkspaces,
    });
  }
  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
  // if (snapshot) {
  //   applySnapshot(_store, snapshot);
  // }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') {
    return _store;
  }
  // Create the store once in the client
  if (!workspaceStore) {
    workspaceStore = _store;
  }

  return workspaceStore;
}

export let workspaceStore: WorkspaceStoreType;
