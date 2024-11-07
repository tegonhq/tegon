import axios from 'axios';

interface RemoveTeamMemberDto {
  userId: string;
  teamId: string;
}

export async function removeTeamMember({
  teamId,
  userId,
}: RemoveTeamMemberDto) {
  const response = await axios.post(`/api/v1/teams/${teamId}/remove-member`, {
    userId,
  });

  return response.data;
}
