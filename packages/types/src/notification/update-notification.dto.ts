import { IsDateString, IsOptional, IsString } from 'class-validator';

export class NotificationIdRequestParams {
  @IsString()
  notificationId: string;
}

export class updateNotificationBody {
  @IsOptional()
  @IsDateString()
  readAt?: Date;

  @IsOptional()
  @IsDateString()
  snoozedUntil?: Date;
}
