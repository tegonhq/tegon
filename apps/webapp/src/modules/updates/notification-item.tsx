import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { NotificationTypeEnum, type NotificationType } from 'common/types';

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
    const { user, isLoading } = useUserData(notification.createdById);
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

    if (isLoading) {
      return null;
    }

    return (
      <div
        key={issue.id}
        className={cn(
          'ml-4 p-3 py-0 mr-4 flex gap-1 items-center hover:bg-grayAlpha-200 rounded',
          issueId === `${team.identifier}-${issue.number}` &&
            'bg-grayAlpha-100',
        )}
        onClick={() => {
          push(`/${workspaceSlug}/inbox/${team.identifier}-${issue.number}`);
          if (!notification.readAt) {
            updateNotification({
              notificationId: notification.id,
              readAt: new Date().toISOString(),
            });
          }
        }}
      >
        <div
          className={cn(
            'flex flex-col gap-1 py-2 w-full',
            !noBorder && 'border-b',
          )}
        >
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
              {getNotificationText(user.username, notification.type)}
            </div>

            <div className="text-muted-foreground">
              <ReactTimeAgo
                date={new Date(issue.updatedAt)}
                timeStyle="twitter"
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);
