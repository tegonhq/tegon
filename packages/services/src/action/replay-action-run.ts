import type { ReplayRunDto } from '@tegonhq/types';

import axios from 'axios';

export async function replayActionRun({ slug, ...data }: ReplayRunDto) {
  const response = await axios.post(`/api/v1/action/${slug}/replay`, data);

  return response.data;
}
