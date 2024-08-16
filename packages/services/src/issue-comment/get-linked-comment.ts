import { GetLinkedCommentDto } from '@tegonhq/types';
import axios from 'axios';

export async function getLinkedComment({ sourceId }: GetLinkedCommentDto) {
  const response = await axios.get(
    `/api/v1/issue_comments/linked_comment/?sourceId=${sourceId}`,
  );

  return response.data;
}
