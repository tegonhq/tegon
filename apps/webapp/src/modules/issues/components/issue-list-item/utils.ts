import { WorkflowCategoryEnum } from '@tegonhq/types';

import { workflowSort } from 'common/sorting';
import type { IssueRelationType, IssueType, WorkflowType } from 'common/types';
import { IssueRelationEnum } from 'common/types';

import { useContextStore } from 'store/global-context-provider';
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
    const blockedIssueRelations = issueRelationsStore.getIssueRelationForType(
      issue.id,
      IssueRelationEnum.BLOCKED,
    );

    return blockedIssueRelations.map((relationAct: IssueRelationType) =>
      issuesStore.getIssueById(relationAct.relatedIssueId),
    );
  }

  if (view === View.BLOCKS) {
    const blocksIssueRelations = issueRelationsStore.getIssueRelationForType(
      issue.id,
      IssueRelationEnum.BLOCKS,
    );

    return blocksIssueRelations.map((relationAct: IssueRelationType) =>
      issuesStore.getIssueById(relationAct.relatedIssueId),
    );
  }

  if (view === View.SUB_ISSUES) {
    const subIssues = issuesStore.getSubIssues(issue.id);

    return subIssues;
  }

  return [];
}

export function useSortIssues(issues: IssueType[]) {
  const { workflowsStore } = useContextStore();

  // Step 1: Get unique workflowIds from issue.stateId
  const uniqueWorkflowIds = Array.from(
    new Set(issues.map((issue) => issue.stateId)),
  );

  const categorySequence = [
    WorkflowCategoryEnum.TRIAGE,
    WorkflowCategoryEnum.BACKLOG,
    WorkflowCategoryEnum.UNSTARTED,
    WorkflowCategoryEnum.STARTED,
    WorkflowCategoryEnum.COMPLETED,
    WorkflowCategoryEnum.CANCELED,
  ];

  const sorting = (a: WorkflowType, b: WorkflowType) => {
    return workflowSort(a, b, categorySequence);
  };

  const workflows = uniqueWorkflowIds
    .map((id) => workflowsStore.getWorkflowWithId(id))
    .sort(sorting)
    .map((workflow: WorkflowType) => workflow.id);

  // Sort issues using the mapped workflow category
  return issues.sort((a, b) => {
    return workflows.indexOf(a.stateId) - workflows.indexOf(b.stateId);
  });
}
