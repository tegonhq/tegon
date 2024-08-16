import { CreateLinkedIssueCommentDto } from '@tegonhq/types';
import axios from 'axios';

export async function createLinkedIssueComment({
  url,
  sourceId,
  source,
  commentId,
  sourceData,
}: CreateLinkedIssueCommentDto) {
  const response = await axios.post(`/api/v1/issue_comments/linked_comment`, {
    url,
    sourceId,
    source,
    commentId,
    sourceData,
  });

  return response.data;
}
