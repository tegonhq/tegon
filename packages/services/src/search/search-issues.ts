import { Issue } from '@tegonhq/types';
import { SearchIssuesDto } from '@tegonhq/types';
import axios from 'axios';

export async function searchIssues({
  query,
  workspaceId,
  limit = 10,
}: SearchIssuesDto): Promise<Issue[]> {
  const response = await axios.get(
    `/api/v1/search?query=${query}&limit=${limit}&workspaceId=${workspaceId}`,
  );

  return response.data;
}
