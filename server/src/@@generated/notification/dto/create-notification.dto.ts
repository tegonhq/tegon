
import {Prisma,NotificationActionType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class CreateNotificationDto {
  deleted?: Date;
@ApiProperty({ enum: NotificationActionType})
type: NotificationActionType;
userId: string;
issueId?: string;
actionData?: Prisma.InputJsonValue;
createdById?: string;
sourceMetadata?: Prisma.InputJsonValue;
readAt?: Date;
snoozedUntil?: Date;
workspaceId: string;
}
