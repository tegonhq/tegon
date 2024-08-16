import type { UpdateIssueCommentDto } from '@tegonhq/types';

import axios from 'axios';

export interface UpdateIssueCommentProps extends UpdateIssueCommentDto {
  issueCommentId: string;
}

export async function updateIssueComment({
  issueCommentId,
  body,
  linkCommentMetadata,
  sourceMetadata,
  parentId,
}: UpdateIssueCommentProps) {
  const response = await axios.post(
    `/api/v1/issue_comments/${issueCommentId}`,
    {
      body,
      parentId,
      sourceMetadata,
      linkCommentMetadata,
    },
  );

  return response.data;
}
