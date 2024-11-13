import { UpdateTeamPreferencesDto } from '@tegonhq/types';
import axios from 'axios';

export interface UpdateTeamPreferencesDtoWithTeamId
  extends UpdateTeamPreferencesDto {
  teamId: string;
}

export async function updateTeamPreferences({
  teamId,
  ...updateData
}: UpdateTeamPreferencesDtoWithTeamId) {
  const response = await axios.post(
    `/api/v1/teams/${teamId}/preferences`,
    updateData,
  );

  return response.data;
}
