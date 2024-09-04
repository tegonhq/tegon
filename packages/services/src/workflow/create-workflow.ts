import {
  CreateWorkflowDTO,
  Workflow,
  WorkflowRequestParamsDto,
} from '@tegonhq/types';
import axios from 'axios';

export interface CreateWorkflowInput
  extends WorkflowRequestParamsDto,
    CreateWorkflowDTO {}

export async function createWorkflows({
  teamId,
  ...data
}: CreateWorkflowInput): Promise<Workflow[]> {
  const response = await axios.post(`/api/v1/${teamId}/workflows`, data);

  return response.data;
}
