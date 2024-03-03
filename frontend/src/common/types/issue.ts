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
