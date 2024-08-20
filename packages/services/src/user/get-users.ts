import { GetUsersDto, PublicUser } from '@tegonhq/types';
import axios from 'axios';

export async function getUsers(data: GetUsersDto): Promise<PublicUser[]> {
  const response = await axios.post(`/api/v1/users`, data);

  return response.data;
}
