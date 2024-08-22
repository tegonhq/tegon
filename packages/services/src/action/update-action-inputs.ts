import type { UpdateActionInputsDto } from '@tegonhq/types';

import axios from 'axios';

export interface UpdateActionInputProps extends UpdateActionInputsDto {
  slug: string;
}

export async function updateActionInputs({
  slug,
  ...data
}: UpdateActionInputProps) {
  const response = await axios.post(`/api/v1/action/${slug}/inputs`, data);

  return response.data;
}
