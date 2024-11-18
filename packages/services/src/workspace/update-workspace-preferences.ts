import { UpdateWorkspacePreferencesDto } from '@tegonhq/types';
import axios from 'axios';

export async function updateWorkspacePreferences(
  updateData: UpdateWorkspacePreferencesDto,
) {
  const response = await axios.post(
    `/api/v1/workspaces/preferences`,
    updateData,
  );

  return response.data;
}
