/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'modules/auth/auth.guard';
import NotificationsService from './notifications.service';
import {
  NotificationIdRequestParams,
  updateNotificationBody,
} from './notifications.interface';
import { Notification } from '@prisma/client';

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
