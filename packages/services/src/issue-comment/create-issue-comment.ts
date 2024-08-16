import { CreateIssueCommentDto } from '@tegonhq/types';
import axios from 'axios';

export class CreateIssueCommentProps extends CreateIssueCommentDto {
  issueId: string;
}

export async function createIssueComment({
  issueId,
  body,
  parentId,
  sourceMetadata,
  linkCommentMetadata,
}: CreateIssueCommentProps) {
  const response = await axios.post(
    `/api/v1/issue_comments?issueId=${issueId}`,
    {
      body,
      sourceMetadata,
      linkCommentMetadata,
      parentId,
    },
  );

  return response.data;
}
