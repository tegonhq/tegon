import type {
  GetIssuesByFilterDTO,
  Issue,
  IssueRequestParamsDto,
} from '@tegonhq/types';

import axios from 'axios';

export async function getIssuesByFilter(
  data: GetIssuesByFilterDTO,
): Promise<Issue[]> {
  const response = await axios.post(`/api/v1/issues/filter`, data);

  return response.data;
}

export async function getIssueById({
  issueId,
}: IssueRequestParamsDto): Promise<Issue> {
  const response = await axios.get(`/api/v1/issues/${issueId}`);

  return response.data;
}
