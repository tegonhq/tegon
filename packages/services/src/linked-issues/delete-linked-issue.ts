import axios from 'axios';

export interface DeleteLinkedIssueParams {
  linkedIssueId: string;
}

export async function deleteLinkedIssue({
  linkedIssueId,
}: DeleteLinkedIssueParams) {
  const response = await axios.delete(`/api/v1/linked_issues/${linkedIssueId}`);

  return response.data;
}
