import type {
  UpdateIssueDto,
  IssueRequestParamsDto,
  TeamRequestParamsDto,
} from '@tegonhq/types';

import axios from 'axios';

export type UpdateIssueParams = UpdateIssueDto &
  IssueRequestParamsDto &
  TeamRequestParamsDto;

export async function updateIssue({
  issueId,
  teamId,
  ...otherParams
}: UpdateIssueParams) {
  const response = await axios.post(
    `/api/v1/issues/${issueId}?teamId=${teamId}`,
    otherParams,
  );

  return response.data;
}
