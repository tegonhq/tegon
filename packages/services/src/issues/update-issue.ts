import type {
  UpdateIssueDto,
  IssueRequestParamsDto,
  TeamRequestParamsDto,
  Issue,
} from '@tegonhq/types';

import axios from 'axios';

export type UpdateIssueParams = UpdateIssueDto &
  IssueRequestParamsDto &
  TeamRequestParamsDto;

export async function updateIssue({
  issueId,
  teamId,
  ...otherParams
}: UpdateIssueParams): Promise<Issue> {
  const response = await axios.post(
    `/api/v1/issues/${issueId}?teamId=${teamId}`,
    otherParams,
  );

  return response.data;
}
