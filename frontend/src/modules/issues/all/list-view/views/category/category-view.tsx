/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { WorkflowCategoryEnum, type WorkflowType } from 'common/types/team';

import { useCurrentTeam } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { CategoryViewItem } from './category-view-item';

export const CategoryView = observer(() => {
  const currentTeam = useCurrentTeam();
  const {
    applicationStore: {
      displaySettings: { showCompletedIssues, showTriageIssues },
    },
  } = useContextStore();

  const categorySequence = [
    WorkflowCategoryEnum.STARTED,
    WorkflowCategoryEnum.UNSTARTED,
    WorkflowCategoryEnum.BACKLOG,
    WorkflowCategoryEnum.TRIAGE,
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
    return a.position - b.position;
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

  return (
    <div>
      {workflows.map((workflow: WorkflowType) => (
        <CategoryViewItem key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
});
