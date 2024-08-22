import { GetViewRequestIdDTO, IssueComment } from '@tegonhq/types';
import axios from 'axios';

export async function getView({
  viewId,
}: GetViewRequestIdDTO): Promise<IssueComment> {
  const response = await axios.get(`/api/v1/views/${viewId}`);

  return response.data;
}
