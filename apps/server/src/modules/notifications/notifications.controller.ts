import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  Notification,
  NotificationIdRequestParams,
  updateNotificationBody,
} from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';

import NotificationsService from './notifications.service';

@Controller({
  version: '1',
  path: 'notifications',
})
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post(':notificationId')
  @UseGuards(AuthGuard)
  async updateNotification(
    @Param()
    notificationRequestParams: NotificationIdRequestParams,
    @Body() notificationData: updateNotificationBody,
  ): Promise<Notification> {
    return await this.notificationsService.updateNotification(
      notificationRequestParams.notificationId,
      notificationData,
    );
  }

  @Delete(':notificationId')
  @UseGuards(AuthGuard)
  async deleteNotification(
    @Param()
    notificationRequestParams: NotificationIdRequestParams,
  ): Promise<Notification> {
    return await this.notificationsService.deleteNotification(
      notificationRequestParams.notificationId,
    );
  }
}
