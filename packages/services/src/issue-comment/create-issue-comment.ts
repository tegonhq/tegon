import { CreateIssueCommentDto } from '@tegonhq/types';
import axios from 'axios';

export class CreateIssueCommentProps extends CreateIssueCommentDto {
  issueId: string;
}

export async function createIssueComment({
  issueId,
  body,
  parentId,
}: CreateIssueCommentProps) {
  const response = await axios.post(
    `/api/v1/issue-comments?issueId=${issueId}`,
    {
      body,
      parentId,
    },
  );

  return response.data;
}
