import type { GetLabelsDTO, Label } from '@tegonhq/types';

import axios from 'axios';

export async function getLabels(data: GetLabelsDTO): Promise<Label[]> {
  const { workspaceId, teamId } = data;
  const url = `/api/v1/labels?workspaceId=${workspaceId}${
    teamId ? `&teamId=${teamId}` : ''
  }`;

  const response = await axios.get(url);

  return response.data;
}
