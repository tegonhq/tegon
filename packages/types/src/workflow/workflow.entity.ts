import { Team } from '../team';

export const WorkflowCategory = {
  TRIAGE: 'TRIAGE',
  BACKLOG: 'BACKLOG',
  UNSTARTED: 'UNSTARTED',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
};

export enum WorkflowCategoryEnum {
  TRIAGE = 'TRIAGE',
  BACKLOG = 'BACKLOG',
  UNSTARTED = 'UNSTARTED',
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export type WorkflowCategory =
  (typeof WorkflowCategory)[keyof typeof WorkflowCategory];

export class Workflow {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  name: string;
  position: number;
  color: string;
  category: WorkflowCategory;
  team?: Team | null;
  teamId: string | null;
}
