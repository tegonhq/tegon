import { WorkflowCategoryEnum } from '@tegonhq/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { workflowSort } from 'common/sorting';
import { type WorkflowType } from 'common/types';

import { useComputedWorkflows } from 'hooks/workflows';

import { TimeBasedFilterEnum, ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { CategoryBoard } from './category-board';
import { CategoryList } from './category-list';

export const CategoryView = observer(() => {
  const {
    applicationStore: {
      displaySettings: { completedFilter, view },
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

  const { workflows: computedWorkflows } = useComputedWorkflows();
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

  return view === ViewEnum.list ? (
    <CategoryList workflows={workflows} />
  ) : (
    <CategoryBoard workflows={workflows} />
  );
});
