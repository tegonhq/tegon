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
  actionData: any | null;
  createdById: string | null;
  sourceMetadata: any | null;
  readAt: Date | null;
  snoozedUntil: Date | null;
  workspaceId: string;
}
