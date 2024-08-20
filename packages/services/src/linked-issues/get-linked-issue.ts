import {
  LinkedIssue,
  LinkedIssueRequestParamsDto,
  LinkedIssueSourceDto,
} from '@tegonhq/types';
import axios from 'axios';

export async function getLinkedIssue({
  linkedIssueId,
}: LinkedIssueRequestParamsDto): Promise<LinkedIssue> {
  const response = await axios.get(`/api/v1/linked_issues/${linkedIssueId}`);

  return response.data;
}

export async function getLinkedIssueBySource({
  sourceId,
}: LinkedIssueSourceDto) {
  const response = await axios.get(
    `/api/v1/linked_issues/source?sourceId=${sourceId}`,
  );

  return response.data;
}
