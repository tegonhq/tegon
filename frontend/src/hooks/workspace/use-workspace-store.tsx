/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type {
  BootstrapResponse,
  SyncActionRecord,
} from 'common/types/data-loader';

import { tegonDatabase } from 'store/database';
import { MODELS } from 'store/models';
import { type WorkspaceStoreType, workspaceStore } from 'store/workspace';

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
        return (
          workspaceStore && (await workspaceStore.updateUsers(userOnWorkspace))
        );
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
      return workspaceStore && (await workspaceStore.update(workspace));
    }),
  );
}

export function useWorkspaceStore(): WorkspaceStoreType {
  return workspaceStore;
}
