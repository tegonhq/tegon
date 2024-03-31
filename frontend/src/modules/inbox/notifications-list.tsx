/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import type { NotificationType } from 'common/types/notification';

import { useContextStore } from 'store/global-context-provider';

import { NotificationItem } from './notification-item';

export const NotificationsList = observer(() => {
  const { notificationsStore } = useContextStore();
  const notifications = notificationsStore.getNotifications;

  return (
    <div className="flex flex-col p-2">
      {notifications.map((notification: NotificationType, index: number) => (
        <NotificationItem
          notification={notification}
          key={notification.id}
          nextNotification={notifications[index + 1]}
        />
      ))}
    </div>
  );
});
