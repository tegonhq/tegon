import { observer } from 'mobx-react-lite';

import type { NotificationType } from 'common/types/notification';

import { Inbox } from 'icons';

import { useContextStore } from 'store/global-context-provider';

export const NotificationRightSide = observer(() => {
  const { notificationsStore } = useContextStore();
  const notifications = notificationsStore.getNotifications.filter(
    (notification: NotificationType) => !notification.readAt,
  );

  return (
    <>
      <Inbox className="text-muted-foreground" size={32} />
      <div className="text-muted-foreground">Inbox</div>
      <div className="text-muted-foreground text-sm">
        {notifications.length} unread notifications
      </div>
    </>
  );
});
