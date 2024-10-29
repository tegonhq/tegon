import type {
  UpdateProjectMilestoneDto,
  ProjectMilestone,
} from '@tegonhq/types';

import axios from 'axios';

interface UpdateProjectMilestoneWithProjectDto
  extends UpdateProjectMilestoneDto {
  projectMilestoneId: string;
}

export async function updateProjectMilestone({
  projectMilestoneId,
  ...updateProjecMilestonetDto
}: UpdateProjectMilestoneWithProjectDto): Promise<ProjectMilestone> {
  const response = await axios.post(
    `/api/v1/projects/milestone/${projectMilestoneId}`,
    updateProjecMilestonetDto,
  );

  return response.data;
}
