/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { BootstrapResponse, SyncActionRecord } from 'common/types/data-loader';

import { useStoreManagement } from 'hooks/use-store-management';

import { tegonDatabase } from 'store/database';
import { MODELS } from 'store/models';
import { workspaceStore } from 'store/workspace';

export async function saveWorkspaceData(data: BootstrapResponse) {
  await Promise.all(
    data.syncActions.map(async (record: SyncActionRecord) => {
      if (record.modelName === MODELS.UsersOnWorkspaces) {
        const userOnWorkspace = {
          id: record.data.id,
          createdAt: record.data.createdAt,
          updatedAt: record.data.updatedAt,
          userId: record.data.userId,
          workspaceId: record.data.workspaceId,
          teamIds: record.data.teamIds,
        };

        await tegonDatabase.usersOnWorkspaces.put(userOnWorkspace);

        // Update the store
        return await workspaceStore.updateUsers(userOnWorkspace);
      }

      const workspace = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        slug: record.data.slug,
      };

      await tegonDatabase.workspaces.put(workspace);

      // Update the store
      return await workspaceStore.update(workspace);
    }),
  );

  await tegonDatabase.sequences.put({
    id: MODELS.Workspace,
    lastSequenceId: data.lastSequenceId,
  });
}

export function useWorkspaceStore() {
  return useStoreManagement({
    store: workspaceStore,
    modelName: [MODELS.Workspace, MODELS.UsersOnWorkspaces],
    onSaveData: saveWorkspaceData,
  });
}
