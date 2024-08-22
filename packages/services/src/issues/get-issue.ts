import type { GetIssuesByFilterDTO } from '@tegonhq/types';

import axios from 'axios';

export async function getIssuesByFilter(data: GetIssuesByFilterDTO) {
  const response = await axios.post(`/api/v1/issues/filter`, data);

  return response.data;
}
