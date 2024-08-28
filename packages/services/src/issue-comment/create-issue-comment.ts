import { CreateIssueCommentDto, IssueComment } from '@tegonhq/types';
import axios from 'axios';

export class CreateIssueCommentProps extends CreateIssueCommentDto {
  issueId: string;
}

export async function createIssueComment({
  issueId,
  ...data
}: CreateIssueCommentProps): Promise<IssueComment> {
  const response = await axios.post(
    `/api/v1/issue_comments?issueId=${issueId}`,
    data,
  );

  return response.data;
}
