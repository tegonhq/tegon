import type {
  CreateLinkedIssueDto,
  IssueRequestParamsDto,
  LinkedIssue,
  TeamRequestParamsDto,
} from '@tegonhq/types';

import axios from 'axios';

export type CreateLinkedIssueParams = CreateLinkedIssueDto &
  TeamRequestParamsDto &
  IssueRequestParamsDto;

export async function createLinkedIssue({
  issueId,
  teamId,
  ...otherParams
}: CreateLinkedIssueParams): Promise<LinkedIssue> {
  const response = await axios.post(
    `/api/v1/issues/${issueId}/link?teamId=${teamId}`,
    otherParams,
  );

  return response.data;
}
