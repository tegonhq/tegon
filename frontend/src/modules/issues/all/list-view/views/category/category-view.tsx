import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { WorkflowCategoryEnum, type WorkflowType } from 'common/types/team';

import { useCurrentTeam } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { CategoryBoard } from './category-board';
import { CategoryList } from './category-list';

export const CategoryView = observer(() => {
  const currentTeam = useCurrentTeam();
  const {
    applicationStore: {
      displaySettings: { showCompletedIssues, showTriageIssues, view },
    },
  } = useContextStore();

  const categorySequence =
    view === ViewEnum.list
      ? [
          WorkflowCategoryEnum.STARTED,
          WorkflowCategoryEnum.UNSTARTED,
          WorkflowCategoryEnum.BACKLOG,
          WorkflowCategoryEnum.TRIAGE,
          WorkflowCategoryEnum.COMPLETED,
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

  function workflowSort(a: WorkflowType, b: WorkflowType): number {
    // Compare categories based on their sequence
    const categoryAIndex = categorySequence.indexOf(a.category);
    const categoryBIndex = categorySequence.indexOf(b.category);
    if (categoryAIndex !== categoryBIndex) {
      return categoryAIndex - categoryBIndex;
    }

    // If categories are the same, compare by position
    return view === ViewEnum.list
      ? b.position - a.position
      : a.position - b.position;
  }

  const workflows = useTeamWorkflows(currentTeam.identifier)
    .filter((workflow: WorkflowType) => {
      if (workflow.category === WorkflowCategoryEnum.TRIAGE) {
        return showTriageIssues;
      }

      if (
        workflow.category === WorkflowCategoryEnum.COMPLETED ||
        workflow.category === WorkflowCategoryEnum.CANCELED
      ) {
        return showCompletedIssues;
      }

      return true;
    })
    .sort(workflowSort);

  return view === ViewEnum.list ? (
    <CategoryList workflows={workflows} />
  ) : (
    <CategoryBoard workflows={workflows} />
  );
});
