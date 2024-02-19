/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { IAnyStateTreeNode, Instance, flow, types } from 'mobx-state-tree';

import { WorkspaceType } from 'common/types/workspace';

import { tegonDatabase } from 'store/database';

import { Workspace, modelName } from './models';

export const WorkspaceStore: IAnyStateTreeNode = types
  .model({
    workspace: types.union(Workspace, types.undefined),
    lastSequenceId: types.union(types.undefined, types.number),
  })
  .actions((self) => ({
    updateWorkspace(workspace: WorkspaceType) {
      self.workspace = workspace;
    },
    updateWorkspaceAPI: flow(function* (workspaceId, workspaceName) {
      try {
        yield fetch(`/api/v1/workspaces/${workspaceId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: workspaceName,
          }),
        });
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }),
    updateLastSequenceId(lastSequenceId: number) {
      self.lastSequenceId = lastSequenceId;
    },
  }));

export type WorkspaceStoreType = Instance<typeof WorkspaceStore>;

export async function initialiseWorkspaceStore(workspaceId: string) {
  let _store = workspaceStore;

  if (!_store) {
    const workspace = await tegonDatabase.workspace.get({
      id: workspaceId,
    });
    const lastSequenceData = await tegonDatabase.sequence.get({
      id: modelName,
    });

    _store = WorkspaceStore.create({
      workspace,
      lastSequenceId: lastSequenceData?.lastSequenceId,
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
