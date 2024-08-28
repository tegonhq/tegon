import type { CreateLabelDto, Label } from '@tegonhq/types';

import axios from 'axios';

export async function createLabel(params: CreateLabelDto): Promise<Label> {
  const response = await axios.post('/api/v1/labels', params);

  return response.data;
}
