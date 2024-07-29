export enum NotificationTypeEnum {
  IssueAssigned = 'IssueAssigned',
  IssueUnAssigned = 'IssueUnAssigned',
  IssueStatusChanged = 'IssueStatusChanged',
  IssuePriorityChanged = 'IssuePriorityChanged',
  IssueNewComment = 'IssueNewComment',
  IssueBlocks = 'IssueBlocks',
}

export interface NotificationType {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: NotificationTypeEnum;
  userId: string;
  issueId?: string;
  actionData?: string;
  createdById?: string;

  sourceMetadata?: string;
  readAt?: string;
  workspaceId: string;
}
