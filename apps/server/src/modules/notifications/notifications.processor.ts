import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { LoggerService } from 'modules/logger/logger.service';
import {
  NotificationData,
  NotificationEventFrom,
} from './notifications.interface';
import NotificationsService from './notifications.service';

@Processor('notifications')
export class NotificationsProcessor {
  constructor(private notificationsService: NotificationsService) {}
  private readonly logger: LoggerService = new LoggerService(
    'NotificationsProcessor',
  );

  @Process('addToNotification')
  async addToNotification(
    job: Job<{
      eventType: NotificationEventFrom;
      createdById: string;
      notificationData: NotificationData;
    }>,
  ) {
    const { eventType, createdById, notificationData } = job.data;

    this.logger.info({
      message: `Adding notification for event ${eventType} by user ${createdById}`,
      where: `NotificationsProcessor.addToNotification`,
    });
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
    this.logger.info({
      message: `Deleting notification for event ${eventType}`,
      where: `NotificationsProcessor.deleteNotificationByEvent`,
    });
    await this.notificationsService.deleteNotificationByEventType(
      eventType,
      notificationData,
    );
  }

  @Process('deleteNotificationsByIssue')
  async deleteNotificationsByIssue(
    job: Job<{
      issueId: string;
    }>,
  ) {
    const { issueId } = job.data;
    this.logger.info({
      message: `Deleting notifications for issue ${issueId}`,
      where: `NotificationsProcessor.deleteNotificationsByIssue`,
    });
    await this.notificationsService.deleteNotificationByIssueId(issueId);
  }
}
