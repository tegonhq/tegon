import type {
  CreateProjectMilestoneDto,
  ProjectMilestone,
} from '@tegonhq/types';

import axios from 'axios';

interface CreateProjectMilestoneWithProjectDto
  extends CreateProjectMilestoneDto {
  projectId: string;
}

export async function createProjectMilestone({
  projectId,
  ...createProjectMilestoneDto
}: CreateProjectMilestoneWithProjectDto): Promise<ProjectMilestone> {
  const response = await axios.post(
    `/api/v1/projects/${projectId}/milestone`,
    createProjectMilestoneDto,
  );

  return response.data;
}
