/** Copyright (c) 2024, Tegon, all rights reserved. **/

export interface TeamType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  identifier: string;
  workspaceId: string;
}

export enum WorkflowCategoryEnum {
  BACKLOG = 'BACKLOG',
  UNSTARTED = 'UNSTARTED',
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface WorkflowType {
  id: string;
  createdAt: string;
  updatedAt: string;

  name:
    | 'Backlog'
    | 'Todo'
    | 'In Progress'
    | 'In Review'
    | 'Done'
    | 'Canceled'
    | 'Triage';
  position: number;
  color: string;
  category: WorkflowCategoryEnum;
  teamId: string;
}
