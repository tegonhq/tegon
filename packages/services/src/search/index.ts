import { Issue } from '@tegonhq/types';
import { SearchIssueDto } from '@tegonhq/types';
import axios from 'axios';

export async function searchIssue({
  query,
  workspaceId,
  limit = 10,
}: SearchIssueDto): Promise<Issue[]> {
  const response = await axios.get(
    `/api/v1/search?query=${query}&limit=${limit}&workspaceId=${workspaceId}`,
  );

  return response.data;
}
