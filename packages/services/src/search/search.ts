import { Issue } from '@tegonhq/types';
import { SearchDto } from '@tegonhq/types';
import axios from 'axios';

export async function search({
  query,
  workspaceId,
  limit = 10,
}: SearchDto): Promise<Issue[]> {
  const response = await axios.get(
    `/api/v1/search?query=${query}&limit=${limit}&workspaceId=${workspaceId}`,
  );

  return response.data;
}
