import type { NotificationType } from '@tegonhq/types';

import { Inbox } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';

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
