import { JsonValue } from '../common';

export enum NotificationActionTypeEnum {
  IssueAssigned = 'IssueAssigned',
  IssueUnAssigned = 'IssueUnAssigned',
  IssueStatusChanged = 'IssueStatusChanged',
  IssuePriorityChanged = 'IssuePriorityChanged',
  IssueNewComment = 'IssueNewComment',
  IssueBlocks = 'IssueBlocks',
}

export const NotificationActionType = {
  IssueAssigned: 'IssueAssigned',
  IssueUnAssigned: 'IssueUnAssigned',
  IssueStatusChanged: 'IssueStatusChanged',
  IssuePriorityChanged: 'IssuePriorityChanged',
  IssueNewComment: 'IssueNewComment',
  IssueBlocks: 'IssueBlocks',
};

export type NotificationActionType =
  (typeof NotificationActionType)[keyof typeof NotificationActionType];

export class Notification {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  type: NotificationActionType;
  userId: string;
  issueId: string | null;
  actionData: JsonValue | null;
  createdById: string | null;
  sourceMetadata: JsonValue | null;
  readAt: Date | null;
  snoozedUntil: Date | null;
  workspaceId: string;
}
