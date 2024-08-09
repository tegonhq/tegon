import type { IssueRelationIdRequestDto } from '@tegonhq/types';

import axios from 'axios';

export async function deleteIssueRelation({
  issueRelationId,
}: IssueRelationIdRequestDto) {
  const response = await axios.delete(
    `/api/v1/issue_relation/${issueRelationId}`,
  );

  return response.data;
}
