import { WorkflowCategoryEnum } from '@tegonhq/types';

import { workflowSort } from 'common/sorting';
import { ViewEnum, type IssueType, type WorkflowType } from 'common/types';

import { useComputedWorkflows } from 'hooks/workflows';

import { TimeBasedFilterEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { getIssueRows } from '../../list-view-utils';

export const useIssueRowsCategory = (issues: IssueType[]) => {
  const { workflows: computedWorkflows } = useComputedWorkflows();

  const {
    applicationStore: {
      displaySettings: { completedFilter, view, showEmptyGroups },
    },
    issuesStore,
    issueRelationsStore,
  } = useContextStore();
  const categorySequence =
    view === ViewEnum.list
      ? [
          WorkflowCategoryEnum.UNSTARTED,
          WorkflowCategoryEnum.STARTED,
          WorkflowCategoryEnum.COMPLETED,
          WorkflowCategoryEnum.BACKLOG,
          WorkflowCategoryEnum.TRIAGE,
          WorkflowCategoryEnum.CANCELED,
        ]
      : [
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

  const workflows = computedWorkflows
    .filter((workflow: WorkflowType) => {
      if (
        workflow.category === WorkflowCategoryEnum.COMPLETED ||
        workflow.category === WorkflowCategoryEnum.CANCELED
      ) {
        return completedFilter !== TimeBasedFilterEnum.None;
      }

      return true;
    })
    .sort(sorting);

  return getIssueRows(
    issues,
    'stateId',
    workflows.map((workflow) => workflow.id),
    showEmptyGroups,
    issuesStore,
    issueRelationsStore,
  );
};
