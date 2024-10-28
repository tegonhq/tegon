import type { UpdateProjectMilestoneDto, Project } from '@tegonhq/types';

import axios from 'axios';

interface UpdateProjectMilestoneWithProjectDto
  extends UpdateProjectMilestoneDto {
  projectMilestoneId: string;
}

export async function updateProjectMilestone({
  projectMilestoneId,
  ...updateProjecMilestonetDto
}: UpdateProjectMilestoneWithProjectDto): Promise<Project> {
  const response = await axios.post(
    `/api/v1/projects/milestone/${projectMilestoneId}`,
    updateProjecMilestonetDto,
  );

  return response.data;
}
