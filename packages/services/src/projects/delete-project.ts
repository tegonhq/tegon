import type { Project } from '@tegonhq/types';

import axios from 'axios';

export async function deleteProject(projectId: string): Promise<Project> {
  const response = await axios.delete(`/api/v1/projects/${projectId}`);

  return response.data;
}
