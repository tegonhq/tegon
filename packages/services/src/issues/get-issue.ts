import type { GetIssuesByFilterDTO, Issue } from '@tegonhq/types';

import axios from 'axios';

export async function getIssuesByFilter(
  data: GetIssuesByFilterDTO,
): Promise<Issue[]> {
  const response = await axios.post(`/api/v1/issues/filter`, data);

  return response.data;
}
