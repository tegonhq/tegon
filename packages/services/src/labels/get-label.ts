import type { GetLabelsDTO } from '@tegonhq/types';

import axios from 'axios';

export async function getLabels({ teamId, workspaceId }: GetLabelsDTO) {
  const response = await axios.get(
    `/api/v1/labels?workspaceId=${workspaceId}&teamId=${teamId}`,
  );

  return response.data;
}
