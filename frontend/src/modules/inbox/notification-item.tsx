/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { cn } from 'common/lib/utils';
import {
  NotificationTypeEnum,
  type NotificationType,
} from 'common/types/notification';

import { useTeamWithId } from 'hooks/teams';
import { useUserData } from 'hooks/users';

import { useUpdateNotificationMutation } from 'services/notifications';

import { useContextStore } from 'store/global-context-provider';

interface NotificationItemProps {
  notification: NotificationType;
  nextNotification: NotificationType | undefined;
}

function getNotificationText(
  userName: string,
  notificationType: NotificationTypeEnum,
): string {
  switch (notificationType) {
    case NotificationTypeEnum.IssueAssigned: {
      return `Assigned by ${userName}`;
    }

    case NotificationTypeEnum.IssueUnAssigned: {
      return `Unassigned by ${userName}`;
    }

    case NotificationTypeEnum.IssueStatusChanged: {
      return `Status changed by ${userName}`;
    }

    case NotificationTypeEnum.IssuePriorityChanged: {
      return `priority changed by ${userName}`;
    }

    case NotificationTypeEnum.IssueNewComment: {
      return `New comment from ${userName}`;
    }

    case NotificationTypeEnum.IssueBlocks: {
      return `Marked as blocked by ${userName}`;
    }
  }

  return 'New notification';
}

export const NotificationItem = observer(
  ({ notification, nextNotification }: NotificationItemProps) => {
    const { issuesStore } = useContextStore();
    const issue = issuesStore.getIssueById(notification.issueId);
    const nextIssue =
      nextNotification && issuesStore.getIssueById(nextNotification.issueId);
    const { userData, isLoading } = useUserData(notification.createdById);
    const {
      query: { issueId, workspaceSlug },
      push,
    } = useRouter();
    const { mutate: updateNotification } = useUpdateNotificationMutation({});
    const team = useTeamWithId(issue.teamId);

    // TODO : will fail when issues are from different teams
    const noBorder =
      (nextIssue && issueId === `${team.identifier}-${nextIssue.number}`) ||
      issueId === `${team.identifier}-${issue.number}`;

    React.useEffect(() => {
      if (!notification.readAt) {
        updateNotification({
          notificationId: notification.id,
          readAt: new Date().toISOString(),
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
      return null;
    }

    return (
      <div
        key={issue.id}
        className={cn(
          'p-4 py-3 flex gap-2 items-center',
          issueId === `${team.identifier}-${issue.number}` &&
            'bg-active rounded-md',
          !noBorder && 'border-b',
        )}
        onClick={() => {
          push(`/${workspaceSlug}/inbox/${team.identifier}-${issue.number}`);
        }}
      >
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between text-sm">
            <div
              className={cn(
                'w-[calc(100%_-_110px)]',
                notification.readAt
                  ? 'text-muted-foreground'
                  : 'text-foreground',
              )}
            >
              <div className="truncate">{issue.title}</div>
            </div>
            <div className="text-muted-foreground w-[70px] text-right">{`${team.identifier}-${issue.number}`}</div>
          </div>

          <div className="flex justify-between text-xs">
            <div className="flex gap-2 text-muted-foreground">
              {getNotificationText(userData.username, notification.type)}
            </div>

            <div className="text-muted-foreground">
              <ReactTimeAgo date={new Date(issue.updatedAt)} />
            </div>
          </div>
        </div>
      </div>
    );
  },
);
