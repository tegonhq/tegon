import type { NotificationsStoreType } from './store';

import type { SyncActionRecord } from 'common/types';

import { tegonDatabase } from 'store/database';

export async function saveNotificationData(
  data: SyncActionRecord[],
  notificationsStore: NotificationsStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const notification = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        type: record.data.type,
        userId: record.data.userId,
        issueId: record.data.issueId,

        actionData: JSON.stringify(record.data.actionData),
        createdById: record.data.createdById,
        sourceMetadata: JSON.stringify(record.data.actionData),

        readAt: record.data.readAt,
        workspaceId: record.data.workspaceId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.notifications.put(notification);
          return (
            notificationsStore &&
            (await notificationsStore.update(notification, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.notifications.put(notification);
          return (
            notificationsStore &&
            (await notificationsStore.update(notification, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.notifications.delete(record.data.id);
          return (
            notificationsStore &&
            (await notificationsStore.deleteById(record.data.id))
          );
        }
      }
    }),
  );
}
