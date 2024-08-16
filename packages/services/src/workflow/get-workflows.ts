import { Workflow, WorkflowRequestParamsDto } from '@tegonhq/types';
import axios from 'axios';

export async function getWorkflowsByTeam({
  teamId,
}: WorkflowRequestParamsDto): Promise<Workflow[]> {
  const response = await axios.get(`/api/v1/${teamId}/workflows`);

  return response.data;
}
