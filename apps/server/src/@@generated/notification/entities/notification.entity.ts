
import {Prisma,NotificationActionType} from '@prisma/client'


export class Notification {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
type: NotificationActionType ;
userId: string ;
issueId: string  | null;
actionData: Prisma.JsonValue  | null;
createdById: string  | null;
sourceMetadata: Prisma.JsonValue  | null;
readAt: Date  | null;
snoozedUntil: Date  | null;
workspaceId: string ;
}
