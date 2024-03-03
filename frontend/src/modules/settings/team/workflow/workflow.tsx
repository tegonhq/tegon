/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { WorkflowCategoryEnum, WorkflowType } from 'common/types/team';

import { Separator } from 'components/ui/separator';

import { useWorkflowStore } from 'store/workflows';

import { WorkflowCategory } from './workflow-category';

export const Workflow = observer(() => {
  const workflowStore = useWorkflowStore();

  const getWorkflows = React.useCallback(
    (categoryName: string) => {
      return workflowStore.workflows.filter(
        (workflow: WorkflowType) => workflow.category === categoryName,
      );
    },
    [workflowStore.workflows],
  );

  return (
    <div>
      <div className="flex flex-col">
        <h2 className="text-2xl"> Workflow </h2>
        <p className="text-sm text-muted-foreground">
          Manage your team worflow settings
        </p>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col">
        <p className="text-sm mb-2 text-muted-foreground">
          Workflows define the type and order of statuses that issues go through
          from start to completion. Here you can customize and re-order the
          available workflow statuses.
        </p>
      </div>

      <div className="mt-4 flex flex-col">
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
    </div>
  );
});
