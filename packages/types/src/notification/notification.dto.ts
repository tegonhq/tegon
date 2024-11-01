export enum NotificationEventFrom {
  IssueCreated,
  IssueUpdated,
  NewComment,
  IssueBlocks,
  DeleteIssue,
  DeleteByEvent,
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
  userId: string;
}
