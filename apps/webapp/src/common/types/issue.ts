import type { IssueRelationEnum } from './issue-relation';

export interface IssueSourceMetadataType {
  type: string;
  id: string;
  userDisplayName: string;
}

export interface IssueType {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  number: number;
  description: string;
  priority: number;
  dueDate?: string;
  sortOrder: number;
  estimate?: number;
  teamId: string;
  createdById?: string;
  assigneeId?: string;
  labelIds: string[];
  parentId?: string;
  stateId: string;
  subscriberIds: string[];
  sourceMetadata?: string;

  projectId?: string;
  projectMilestoneId?: string;

  // for frontend usage
  children?: IssueType[];
  parent?: IssueType;
}

export interface IssueHistoryType {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  issueId: string;
  addedLabelIds: string[];
  removedLabelIds: string[];
  fromPriority?: number;
  toPriority?: number;
  fromStateId?: string;
  toStateId?: string;
  fromEstimate?: number;
  toEstimate?: number;
  fromAssigneeId?: string;
  toAssigneeId?: string;
  fromParentId?: string;
  toParentId?: string;
  relationChanges?: {
    isDeleted?: boolean;
    issueId: string;
    relatedIssueId: string;
    type: IssueRelationEnum;
  };
}

export interface IssueCommentType {
  id: string;
  createdAt: string;
  updatedAt: string;

  body: string;
  userId: string;

  issueId: string;
  parentId: string;
  sourceMetadata?: string;
}

export enum SubscribeType {
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export interface IssueSuggestionType {
  id: string;
  createdAt: string;
  updatedAt: string;
  issueId: string;
  suggestedLabelIds: string[];
  suggestedAssigneeId?: string;
}
