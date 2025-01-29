import { CreateTeamDto } from '@tegonhq/types';
import axios from 'axios';

export async function createTeam(teamData: CreateTeamDto) {
  const response = await axios.post(`/api/v1/teams`, teamData);

  return response.data;
}
