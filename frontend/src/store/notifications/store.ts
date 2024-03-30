/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { NotificationType } from 'common/types/notification';

import { tegonDatabase } from 'store/database';

import { Notification } from './models';

export const NotificationsStore: IAnyStateTreeNode = types
  .model({
    notifications: types.array(Notification),
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

      self.notifications = notifications;
    });

    return { update, deleteById, load };
  });

export type NotificationsStoreType = Instance<typeof NotificationsStore>;
