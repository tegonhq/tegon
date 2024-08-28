import type { IssueRelation, IssueRelationIdRequestDto } from '@tegonhq/types';

import axios from 'axios';

export async function deleteIssueRelation({
  issueRelationId,
}: IssueRelationIdRequestDto): Promise<IssueRelation> {
  const response = await axios.delete(
    `/api/v1/issue_relation/${issueRelationId}`,
  );

  return response.data;
}
