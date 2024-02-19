/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Separator } from 'components/ui/separator';

import { useWorkflowStore } from 'store/workflow';

export function Workflow() {
  const workflowStore = useWorkflowStore();
  console.log(workflowStore.workflows.toJSON());

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
    </div>
  );
}
