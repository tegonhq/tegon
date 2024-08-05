export enum WorkflowCategoryEnum {
  TRIAGE = 'TRIAGE',
  BACKLOG = 'BACKLOG',
  UNSTARTED = 'UNSTARTED',
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface WorkflowType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date;

  name: string;
  position: number;
  color: string;
  category: WorkflowCategoryEnum;

  teamId: string;
}
