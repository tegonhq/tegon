import type { WorkspaceStoreType } from './store';

import type { SyncActionRecord } from 'common/types';

import { tegonDatabase } from 'store/database';
import { MODELS } from 'store/models';

export async function saveWorkspaceData(
  data: SyncActionRecord[],
  workspaceStore: WorkspaceStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      if (record.modelName === MODELS.UsersOnWorkspaces) {
        const userOnWorkspace = {
          id: record.data.id,
          createdAt: record.data.createdAt,
          updatedAt: record.data.updatedAt,
          userId: record.data.userId,
          workspaceId: record.data.workspaceId,
          teamIds: record.data.teamIds,
          role: record.data.role,
        };

        await tegonDatabase.usersOnWorkspaces.put(userOnWorkspace);

        // Update the store
        return (
          workspaceStore &&
          (await workspaceStore.updateUsers(userOnWorkspace, record.data.id))
        );
      }

      const workspace = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        actionsEnabled: record.data.actionsEnabled,
        preferences: record.data.preferences,
        slug: record.data.slug,
      };

      await tegonDatabase.workspaces.put(workspace);

      // Update the store
      return workspaceStore && (await workspaceStore.update(workspace));
    }),
  );
}
