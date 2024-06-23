/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { SettingSection } from 'modules/settings/setting-section';

import { WorkflowCategoryEnum, type WorkflowType } from 'common/types/team';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { WorkflowCategory } from './workflow-category';

export const Workflow = observer(() => {
  const { workflowsStore } = useContextStore();
  const currentTeam = useCurrentTeam();

  const getWorkflows = React.useCallback(
    (categoryName: string) => {
      return workflowsStore
        .getWorkflowsForTeam(currentTeam.id)
        .filter((workflow: WorkflowType) => workflow.category === categoryName);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workflowsStore.workflows, currentTeam.id],
  );

  return (
    <SettingSection
      title="Workflow"
      description="Workflows define the type and order of statuses that issues go through
    from start to completion. Here you can customize and re-order the
    available workflow statuses."
    >
      <div className="flex flex-col">
        <WorkflowCategory
          categoryName={WorkflowCategoryEnum.BACKLOG}
          workflows={getWorkflows(WorkflowCategoryEnum.BACKLOG)}
        />
        <WorkflowCategory
          categoryName={WorkflowCategoryEnum.UNSTARTED}
          workflows={getWorkflows(WorkflowCategoryEnum.UNSTARTED)}
        />
        <WorkflowCategory
          categoryName={WorkflowCategoryEnum.STARTED}
          workflows={getWorkflows(WorkflowCategoryEnum.STARTED)}
        />
        <WorkflowCategory
          categoryName={WorkflowCategoryEnum.COMPLETED}
          workflows={getWorkflows(WorkflowCategoryEnum.COMPLETED)}
        />
        <WorkflowCategory
          categoryName={WorkflowCategoryEnum.CANCELED}
          workflows={getWorkflows(WorkflowCategoryEnum.CANCELED)}
        />
      </div>
    </SettingSection>
  );
});
