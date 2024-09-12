import type { ReplayRunDto } from '@tegonhq/types';

import axios from 'axios';

export async function cancelActionRun({ slug, ...data }: ReplayRunDto) {
  const response = await axios.post(`/api/v1/action/${slug}/cancel`, data);

  return response.data;
}
