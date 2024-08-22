import { Pat } from '@tegonhq/types';
import axios from 'axios';

export async function getPats(): Promise<Pat[]> {
  const response = await axios.get(`/api/v1/users/pats`);

  return response.data;
}
