import type { LabelRequestParamsDto, UpdateLabelDto } from '@tegonhq/types';

import axios from 'axios';

type UpdateLabelParams = LabelRequestParamsDto & UpdateLabelDto;

export async function updateLabel(params: UpdateLabelParams) {
  const { labelId, ...otherParams } = params;

  const response = await axios.post(`/api/v1/labels/${labelId}`, otherParams);

  return response.data;
}
