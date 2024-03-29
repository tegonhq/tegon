/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import {
  NotificationData,
  NotificationEventFrom,
} from './notifications.interface';
import NotificationsService from './notifications.service';

@Processor('notifications')
export class NotificationsProcessor {
  constructor(private notificationsService: NotificationsService) {}
  private readonly logger: Logger = new Logger('NotificationsProcessor');

  @Process('addToNotification')
  async addToNotification(
    job: Job<{
      eventType: NotificationEventFrom;
      createdById: string;
      notificationData: NotificationData;
    }>,
  ) {
    const { eventType, createdById, notificationData } = job.data;

    this.logger.log(
      `Adding notification for event ${eventType} by user ${createdById}`,
    );
    await this.notificationsService.createNotification(
      eventType,
      createdById,
      notificationData,
    );
  }

  @Process('deleteNotificationByEvent')
  async deleteNotificationByEvent(
    job: Job<{
      eventType: NotificationEventFrom;
      notificationData: NotificationData;
    }>,
  ) {
    const { eventType, notificationData } = job.data;
    this.logger.log(`Adding notification for event ${eventType}`);
    await this.notificationsService.deleteNotificationByEventType(
      eventType,
      notificationData,
    );
  }
}
