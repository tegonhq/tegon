import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { LoggerService } from 'modules/logger/logger.service';
import {
  NotificationData,
  NotificationEventFrom,
} from './notifications.interface';

@Injectable()
export class NotificationsQueue {
  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}
  private readonly logger: LoggerService = new LoggerService(
    'NotificationsQueue',
  );

  async addToNotification(
    eventType: NotificationEventFrom,
    createdById: string,
    notificationData: NotificationData,
  ) {
    this.logger.info({
      message: `Adding notifications to Queue with event: ${eventType}`,
      where: `NotificationsQueue.addToNotification`,
    });
    return this.notificationsQueue.add('addToNotification', {
      eventType,
      createdById,
      notificationData,
    });
  }

  async deleteNotificationByEvent(
    eventType: NotificationEventFrom,
    notificationData: NotificationData,
  ) {
    return this.notificationsQueue.add('deleteNotificationByEvent', {
      eventType,
      notificationData,
    });
  }

  async deleteNotificationsByIssue(issueId: string) {
    return this.notificationsQueue.add('deleteNotificationsByIssue', {
      issueId,
    });
  }
}
