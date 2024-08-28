import type { GetLabelsDTO, Label } from '@tegonhq/types';

import axios from 'axios';

export async function getLabels({
  teamId,
  workspaceId,
}: GetLabelsDTO): Promise<Label[]> {
  const response = await axios.get(
    `/api/v1/labels?workspaceId=${workspaceId}&teamId=${teamId}`,
  );

  return response.data;
}
