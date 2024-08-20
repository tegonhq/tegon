import { CreateLinkedIssueCommentDto } from '@tegonhq/types';
import axios from 'axios';

export async function createLinkedIssueComment(
  createLinkedIssueDto: CreateLinkedIssueCommentDto,
) {
  const response = await axios.post(
    `/api/v1/issue_comments/linked_comment`,
    createLinkedIssueDto,
  );

  return response.data;
}
