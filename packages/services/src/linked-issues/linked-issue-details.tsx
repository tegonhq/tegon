import axios from 'axios';

export async function getLinkedIssueDetails(linkedIssueId: string) {
  const response = await axios.get(
    `/api/v1/linked_issues/${linkedIssueId}/details`,
  );

  return response.data;
}
