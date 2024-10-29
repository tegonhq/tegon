import { ProjectMilestone } from './project-milestone.entity';
import { Workspace } from '../workspace';

export class Project {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  name: string;
  description: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  leadUserId: string | null;
  teams: string[];

  milestones: ProjectMilestone[];
  workspace: Workspace;
  workspaceId: string;
}
