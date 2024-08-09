import type { CreateLabelDto } from '@tegonhq/types';

import axios from 'axios';

export async function createLabel(params: CreateLabelDto) {
  const response = await axios.post('/api/v1/labels', params);

  return response.data;
}
