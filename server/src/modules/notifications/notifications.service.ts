import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Notification, NotificationActionType } from '@prisma/client';

import {
  NotificationData,
  NotificationEventFrom,
  updateNotificationBody,
} from './notifications.interface';
import { getNotificationCreateData } from './notifications.utils';

@Injectable()
export default class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    eventType: NotificationEventFrom,
    createdById: string,
    notificationData: NotificationData,
  ) {
    const { issueId, sourceMetadata, workspaceId } = notificationData;

    const { type, actionData, subscriberIds } = await getNotificationCreateData(
      this.prisma,
      eventType,
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
            existingNotification = await this.prisma.notification.findFirst({
              where: {
                userId,
                issueId,
              },
            });
          }

          if (!existingNotification) {
            await this.prisma.notification.create({
              data: {
                type,
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
  }

  async deleteNotificationByEventType(
    eventType: NotificationEventFrom,
    notificationData: NotificationData,
  ) {
    let type: NotificationActionType;
    let actionData: Record<string, string> = {};
    if (eventType === NotificationEventFrom.IssueBlocks) {
      type = NotificationActionType.IssueBlocks;
      actionData = { issueRelationId: notificationData.issueRelationId };
    }
    return await this.prisma.notification.updateMany({
      where: {
        actionData: { path: [], equals: actionData },
        type,
        issueId: notificationData.issueId,
      },
      data: { deleted: new Date().toISOString() },
    });
  }

  async deleteNotification(notificationId: string): Promise<Notification> {
    return await this.prisma.notification.update({
      where: { id: notificationId },
      data: { deleted: new Date().toISOString() },
    });
  }

  async updateNotification(
    notificationId: string,
    notificationData: updateNotificationBody,
  ): Promise<Notification> {
    return await this.prisma.notification.update({
      where: { id: notificationId },
      data: notificationData,
    });
  }
}
