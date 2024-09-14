import {
  UpdateWorkflowDTO,
  Workflow,
  WorkflowRequestParamsDto,
} from '@tegonhq/types';
import axios from 'axios';

export interface UpdateWorkflowInput
  extends WorkflowRequestParamsDto,
    UpdateWorkflowDTO {}

export async function updateWorkflow({
  teamId,
  workflowId,
  ...data
}: UpdateWorkflowInput): Promise<Workflow> {
  const response = await axios.post(
    `/api/v1/${teamId}/workflows/${workflowId}`,
    data,
  );

  return response.data;
}
