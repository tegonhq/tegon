import type { UpdateIssueCommentDto } from '@tegonhq/types';

import axios from 'axios';

export interface UpdateIssueCommentProps extends UpdateIssueCommentDto {
  issueCommentId: string;
}

export async function updateIssueComment({
  issueCommentId,
  body,
  parentId,
}: UpdateIssueCommentProps) {
  const response = await axios.post(
    `/api/v1/issue-comments/${issueCommentId}`,
    {
      body,
      parentId,
    },
  );

  return response.data;
}
