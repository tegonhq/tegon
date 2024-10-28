export class ProjectMilestone {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  name: string;
  description: string | null;
  endDate: string | null;

  projectId: string;
}
