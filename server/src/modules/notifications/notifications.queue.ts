/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import {
  NotificationData,
  NotificationEventFrom,
} from './notifications.interface';

@Injectable()
export class NotificationsQueue {
  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}
  private readonly logger: Logger = new Logger('NotificationsQueue');

  async addToNotification(
    eventType: NotificationEventFrom,
    createdById: string,
    notificationData: NotificationData,
  ) {
    this.logger.log(`Adding notifications to Queue with event: ${eventType}`);
    return await this.notificationsQueue.add('addToNotification', {
      eventType,
      createdById,
      notificationData,
    });
  }

  async deleteNotificationByEvent(
    eventType: NotificationEventFrom,
    notificationData: NotificationData,
  ) {
    return await this.notificationsQueue.add('deleteNotificationByEvent', {
      eventType,
      notificationData,
    });
  }
}
