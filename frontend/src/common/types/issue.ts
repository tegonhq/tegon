/** Copyright (c) 2024, Tegon, all rights reserved. **/

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
  createdById: string;
  assigneeId?: string;
  labelIds: string[];
  parentId?: string;
  stateId: string;
}

export interface IssueHistoryType {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
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
}

export const Priorities = ['No priority', 'Urgent', 'High', 'Medium', 'Low'];

export interface IssueCommentType {
  id: string;
  createdAt: string;
  updatedAt: string;

  body: string;
  userId: string;

  issueId: string;
}
