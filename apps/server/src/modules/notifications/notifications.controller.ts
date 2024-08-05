import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Notification } from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';

import {
  NotificationIdRequestParams,
  updateNotificationBody,
} from './notifications.interface';
import NotificationsService from './notifications.service';

@Controller({
  version: '1',
  path: 'notifications',
})
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post(':notificationId')
  @UseGuards(new AuthGuard())
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
  @UseGuards(new AuthGuard())
  async deleteNotification(
    @Param()
    notificationRequestParams: NotificationIdRequestParams,
  ): Promise<Notification> {
    return await this.notificationsService.deleteNotification(
      notificationRequestParams.notificationId,
    );
  }
}
