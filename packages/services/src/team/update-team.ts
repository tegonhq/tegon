import { UpdateTeamDto } from '@tegonhq/types';
import axios from 'axios';

export interface UpdateTeamDtoWithTeamId extends UpdateTeamDto {
  teamId: string;
}

export async function updateTeam({
  teamId,
  ...updateData
}: UpdateTeamDtoWithTeamId) {
  const response = await axios.post(`/api/v1/teams/${teamId}`, updateData);

  return response.data;
}
