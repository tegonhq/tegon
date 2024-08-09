import {
  CreateIssueCommentDto,
  IntegrationDefinition,
  WorkspaceRequestParamsDto,
} from '@tegonhq/types';
import axios from 'axios';

export class CreateIssueCommentProps extends CreateIssueCommentDto {
  issueId: string;
}

export async function getIntegrationDefinitions({
  workspaceId,
}: WorkspaceRequestParamsDto): Promise<IntegrationDefinition[]> {
  const response = await axios.get(
    `/api/v1/integration_definition?workspaceId=${workspaceId}`,
  );

  return response.data;
}
