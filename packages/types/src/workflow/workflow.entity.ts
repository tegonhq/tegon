import { Team } from '../team';

export enum WorkflowCategory {
  TRIAGE = 'TRIAGE',
  BACKLOG = 'BACKLOG',
  UNSTARTED = 'UNSTARTED',
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

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
