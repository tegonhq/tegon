import type { ActionIdDto } from '@tegonhq/types';

import axios from 'axios';

export async function deleteAction({ actionId }: ActionIdDto) {
  const response = await axios.delete(`/api/v1/action/${actionId}`);

  return response.data;
}
