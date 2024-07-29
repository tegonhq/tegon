import type { NotificationType } from '@tegonhq/types';

import { sort } from 'fast-sort';
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import { tegonDatabase } from 'store/database';

import { Notifications } from './models';

export const NotificationsStore: IAnyStateTreeNode = types
  .model({
    notifications: Notifications,
  })
  .actions((self) => {
    const update = (notification: NotificationType, id: string) => {
      const indexToUpdate = self.notifications.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.notifications[indexToUpdate] = {
          ...self.notifications[indexToUpdate],
          ...notification,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.notifications.push(notification);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.notifications.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToDelete !== -1) {
        self.notifications.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* () {
      const notifications = yield tegonDatabase.notifications.toArray();

      self.notifications = Notifications.create(
        sort(notifications).desc(
          (notification: NotificationType) => new Date(notification.updatedAt),
        ),
      );
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    get getNotifications() {
      const latestCreatedAt: Record<string, string> = {};
      const latestObjects: Record<string, NotificationType> = {};

      // Iterate through the array to find the latest object for each issueId
      self.notifications.forEach((obj) => {
        const { issueId, updatedAt } = obj;

        // Update latest updatedAt if the current object's updatedAt is later
        if (!latestCreatedAt[issueId] || updatedAt > latestCreatedAt[issueId]) {
          latestCreatedAt[issueId] = updatedAt;
          latestObjects[issueId] = obj as NotificationType;
        }
      });

      // Return the latest objects for each issueId
      return Object.values(latestObjects);
    },
    get unReadCount() {
      return (self as NotificationsStoreType).getNotifications.filter(
        (obj: NotificationType) => !obj.readAt,
      ).length;
    },
  }));

export type NotificationsStoreType = Instance<typeof NotificationsStore>;
