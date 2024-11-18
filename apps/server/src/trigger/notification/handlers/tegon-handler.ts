import { PrismaClient } from '@prisma/client';
import {
  ActionEventPayload,
  ActionTypesEnum,
  Notification,
  NotificationActionType,
  NotificationActionTypeEnum,
  NotificationEventFrom,
} from '@tegonhq/types';

import { getNotificationCreateData } from '../utils';

const prisma = new PrismaClient();

export const tegonHandler = async (payload: ActionEventPayload) => {
  const {
    notificationData: {
      issueId,
      sourceMetadata,
      workspaceId,
      userId: createdById,
    },
    notificationType,
    notificationData,
  } = payload;

  switch (payload.event) {
    case ActionTypesEnum.ON_CREATE:
    case ActionTypesEnum.ON_UPDATE:
      const { type, actionData, subscriberIds } =
        await getNotificationCreateData(
          prisma,
          notificationType,
          createdById,
          notificationData,
        );

      if (subscriberIds.length > 0 && type) {
        const notificationPromises = subscriberIds
          .filter((userId) => userId !== createdById)
          .map(async (userId) => {
            let existingNotification: Notification;
            if (
              type === NotificationActionType.IssueStatusChanged ||
              type === NotificationActionType.IssuePriorityChanged
            ) {
              existingNotification = await prisma.notification.findFirst({
                where: {
                  userId,
                  issueId,
                },
              });
            }

            if (!existingNotification) {
              await prisma.notification.create({
                data: {
                  type: type as NotificationActionTypeEnum,
                  userId,
                  issueId,
                  createdById,
                  actionData,
                  sourceMetadata,
                  workspaceId,
                },
              });
            }
          });

        await Promise.all(notificationPromises);
      }
      return { message: 'created notifications' };

    case ActionTypesEnum.ON_DELETE:
      switch (notificationType) {
        case NotificationEventFrom.DeleteByEvent:
          let type: NotificationActionType;
          let actionData: Record<string, string> = {};
          if (notificationType === NotificationEventFrom.IssueBlocks) {
            type = NotificationActionType.IssueBlocks;
            actionData = { issueRelationId: notificationData.issueRelationId };
          }
          await prisma.notification.updateMany({
            where: {
              actionData: { path: [], equals: actionData },
              type: type as NotificationActionTypeEnum,
              issueId: notificationData.issueId,
            },
            data: { deleted: new Date().toISOString() },
          });
          return { message: 'Deleted notifications by event' };

        case NotificationEventFrom.DeleteIssue:
          await prisma.notification.updateMany({
            where: { issueId },
            data: { deleted: new Date().toISOString() },
          });
          return { message: 'Deleted notifications by issue' };

        default:
          return {
            message: `Notification type ${payload.type} is not recognized`,
          };
      }

    default:
      return {
        message: `The event payload type "${payload.event}" is not recognized`,
      };
  }
};
