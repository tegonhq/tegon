/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IssueType } from 'common/types/issue';

export function filterIssues(
  issues: IssueType[],
  filters: string,
): IssueType[] {
  const filterObj = JSON.parse(filters);
  let filteredIssues = issues;

  if (filterObj['status'] && filterObj['status'].length > 0) {
    filteredIssues = filteredIssues.filter((issue: IssueType) =>
      filterObj['status'].includes(issue.stateId),
    );
  }

  if (filterObj['assignee'] && filterObj['assignee'].length > 0) {
    filteredIssues = filteredIssues.filter((issue: IssueType) =>
      filterObj['assignee'].includes(issue.assigneeId),
    );
  }

  if (filterObj['label'] && filterObj['label'].length > 0) {
    filteredIssues = filteredIssues.filter((issue: IssueType) =>
      filterObj['label'].some((labelId: string) =>
        issue.labelIds.includes(labelId),
      ),
    );
  }

  return filteredIssues;
}
