import { Injectable } from '@nestjs/common';
import { Notification, updateNotificationBody } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export default class NotificationsService {
  constructor(private prisma: PrismaService) {}

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
