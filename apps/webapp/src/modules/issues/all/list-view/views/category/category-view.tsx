import { WorkflowCategoryEnum } from '@tegonhq/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { workflowSort } from 'common/sorting';
import { type WorkflowType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

import { TimeBasedFilterEnum, ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { CategoryBoard } from './category-board';
import { CategoryList } from './category-list';

export const CategoryView = observer(() => {
  const currentTeam = useCurrentTeam();
  const {
    applicationStore: {
      displaySettings: { completedFilter, showTriageIssues, view },
    },
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

  const workflows = useTeamWorkflows(currentTeam.identifier)
    .filter((workflow: WorkflowType) => {
      if (workflow.category === WorkflowCategoryEnum.TRIAGE) {
        return showTriageIssues;
      }

      if (
        workflow.category === WorkflowCategoryEnum.COMPLETED ||
        workflow.category === WorkflowCategoryEnum.CANCELED
      ) {
        return completedFilter !== TimeBasedFilterEnum.None;
      }

      return true;
    })
    .sort(sorting);

  return view === ViewEnum.list ? (
    <CategoryList workflows={workflows} />
  ) : (
    <CategoryBoard workflows={workflows} />
  );
});
