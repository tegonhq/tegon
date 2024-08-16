import {
  LinkedIssueRequestParamsDto,
  LinkedIssueSourceDto,
} from '@tegonhq/types';
import axios from 'axios';

export async function getLinkedIssueDetails({
  linkedIssueId,
}: LinkedIssueRequestParamsDto) {
  const response = await axios.get(
    `/api/v1/linked_issues/${linkedIssueId}/details`,
  );

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
