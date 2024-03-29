/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsDateString, IsOptional, IsString } from 'class-validator';

export enum NotificationEventFrom {
  IssueCreated,
  IssueUpdated,
  NewComment,
  IssueBlocks,
}

export interface NotificationData {
  issueId?: string;
  fromPriority?: number;
  toPriority?: number;
  fromStateId?: string;
  toStateId?: string;
  fromAssigneeId?: string;
  toAssigneeId?: string;
  issueCommentId?: string;
  subscriberIds: string[];
  sourceMetadata?: Record<string, string>;
  issueRelationId?: string;
  workspaceId: string;
}

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
