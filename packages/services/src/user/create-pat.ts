import type { CreatePatDto } from '@tegonhq/types';

import axios from 'axios';

export async function createPat(createPatDto: CreatePatDto) {
  const response = await axios.post(`/api/v1/users/pat`, createPatDto);

  return response.data;
}
