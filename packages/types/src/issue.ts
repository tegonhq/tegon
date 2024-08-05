import type { IssueRelationEnum, IssueRelationType } from './issue-relation';
import type { Integration } from './linked-issue';

import { TeamType } from './team';
import { User } from './user';

export interface IssueSourceMetadataType {
  type: Integration;
  id: string;
  userDisplayName: string;
}

export interface IssueType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted?: Date;

  title: string;
  number: number;
  description: string;
  priority: number;
  dueDate?: Date;
  sortOrder: number;
  subIssueSortOrder?: number;
  estimate?: number;
  teamId: string;
  createdById?: string;
  assigneeId?: string;
  labelIds: string[];
  parentId?: string;
  stateId: string;
  subscriberIds: string[];
  attachments: string[];

  sourceMetadata?: any;
  isBidirectional?: boolean;

  // for frontend usage
  children?: IssueType[];
  parent?: IssueType;
}

export interface IssueWithRelations extends IssueType {
  team?: TeamType;
  createdBy?: User;
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

export const Priorities = ['No priority', 'Urgent', 'High', 'Medium', 'Low'];

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

export interface LinkIssueData {
  url: string;
  sourceId: string;
  source?: Record<string, string | number>;
  sourceData?: Record<string, string | number>;
  createdById?: string;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  priority?: number;
  dueDate?: Date;
  sortOrder?: number;
  subIssueSortOrder?: number;
  estimate?: number;
  labelIds?: string[];
  assigneeId?: string;
  stateId?: string;
  parentId?: string;
  isBidirectional?: boolean;
  subscriberIds?: string[];
  issueRelation?: IssueRelationInput;
  attachments?: string[];
  userId?: string;
  linkIssueData?: LinkIssueData;
  sourceMetadata?: Record<string, string>;
}
export class IssueRelationInput {
  type?: IssueRelationType;
  issueId?: string;
  relatedIssueId?: string;
}
