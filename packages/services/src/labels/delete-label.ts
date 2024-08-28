import type { Label, LabelRequestParamsDto } from '@tegonhq/types';

import axios from 'axios';

export async function deleteLabel({
  labelId,
}: LabelRequestParamsDto): Promise<Label> {
  const response = await axios.delete(`/api/v1/labels/${labelId}`);

  return response.data;
}
