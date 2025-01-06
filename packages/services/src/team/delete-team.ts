import { TeamRequestParamsDto } from '@tegonhq/types';
import axios from 'axios';

export async function deleteTeam({ teamId }: TeamRequestParamsDto) {
  const response = await axios.delete(`/api/v1/teams/${teamId}`);

  return response.data;
}
