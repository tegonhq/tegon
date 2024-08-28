import type { IssueComment, UpdateIssueCommentDto } from '@tegonhq/types';

import axios from 'axios';

export interface UpdateIssueCommentProps extends UpdateIssueCommentDto {
  issueCommentId: string;
}

export async function updateIssueComment({
  issueCommentId,
  ...data
}: UpdateIssueCommentProps): Promise<IssueComment> {
  const response = await axios.post(
    `/api/v1/issue_comments/${issueCommentId}`,
    data,
  );

  return response.data;
}
