import type { LabelRequestParamsDto } from '@tegonhq/types';

import axios from 'axios';

export async function deleteLabel({ labelId }: LabelRequestParamsDto) {
  const response = await axios.delete(`/api/v1/labels/${labelId}`);

  return response.data;
}
