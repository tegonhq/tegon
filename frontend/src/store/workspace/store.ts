/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { IAnyStateTreeNode, Instance, flow, types } from 'mobx-state-tree';

import { WorkspaceType } from 'common/types/workspace';

import { Workspace } from './models';

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

export const workspaceStore: WorkspaceStoreType | undefined =
  WorkspaceStore.create({ workspace: undefined, lastSequenceId: undefined });
