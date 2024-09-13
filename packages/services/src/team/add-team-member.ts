import { AddTeamMemberDto } from '@tegonhq/types';
import axios from 'axios';

export async function addTeamMember({ teamId, userId }: AddTeamMemberDto) {
  const response = await axios.post(`/api/v1/teams/${teamId}/add-member`, {
    userId,
  });

  return response.data;
}
