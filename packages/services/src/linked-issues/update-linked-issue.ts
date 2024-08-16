import type {
  LinkedIssueRequestParamsDto,
  UpdateLinkedIssueDto,
} from '@tegonhq/types';

import axios from 'axios';

export type UpdateLinkedIssueParams = UpdateLinkedIssueDto &
  LinkedIssueRequestParamsDto;

export async function updateLinkedIssue({
  linkedIssueId,
  ...otherParams
}: UpdateLinkedIssueParams) {
  const response = await axios.post(
    `/api/v1/linked_issues/${linkedIssueId}`,
    otherParams,
  );

  return response.data;
}

export async function updateLinkedIssueBySource({
  sourceId,
  ...otherParams
}: UpdateLinkedIssueDto) {
  const response = await axios.post(
    `/api/v1/linked_issues/source/${sourceId}`,
    otherParams,
  );

  return response.data;
}
