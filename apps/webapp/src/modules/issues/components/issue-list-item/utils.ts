import type { IssueType } from '@tegonhq/types';

import { IssueRelationEnum } from '@tegonhq/types';

import type { IssueRelationsStoreType } from 'store/issue-relation';
import type { IssuesStoreType } from 'store/issues';

import { View } from './issue-relations';

export function getRelationIssues({
  issuesStore,
  issueRelationsStore,
  view,
  issue,
}: {
  issuesStore: IssuesStoreType;
  issueRelationsStore: IssueRelationsStoreType;
  view: View;
  issue: IssueType;
}) {
  if (view === View.BLOCKED) {
    const blockedIssues = issueRelationsStore.getIssueRelationForType(
      issue.id,
      IssueRelationEnum.BLOCKED,
    );

    return blockedIssues;
  }

  if (view === View.BLOCKS) {
    const blocksIssues = issueRelationsStore.getIssueRelationForType(
      issue.id,
      IssueRelationEnum.BLOCKS,
    );

    return blocksIssues;
  }

  if (view === View.SUB_ISSUES) {
    const subIssues = issuesStore.getSubIssues(issue.id);

    return subIssues;
  }

  return [];
}
