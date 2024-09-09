import { RiPencilFill } from '@remixicon/react';
import { Button } from '@tegonhq/ui/components/button';
import { getWorkflowColor } from 'common/status-color';
import type { WorkflowType } from 'common/types';
import { WORKFLOW_CATEGORY_ICONS } from 'common/workflow-icons';

interface WorkflowItemProps {
  workflow: WorkflowType;
}

export function WorkflowItem({ workflow }: WorkflowItemProps) {
  const CategoryIcon =
    WORKFLOW_CATEGORY_ICONS[workflow.name] ??
    WORKFLOW_CATEGORY_ICONS['Backlog'];

  return (
    <div
      key={workflow.name}
      className="w-full group flex justify-between mb-2 rounded-md bg-background-3 p-2 px-2"
    >
      <div className="flex items-center">
        <CategoryIcon
          size={20}
          className="text-muted-foreground"
          color={getWorkflowColor(workflow).color}
        />
        <h3 className="pl-2"> {workflow.name} </h3>
      </div>

      <div className="hidden group-hover:flex items-center justify-center gap-4">
        <Button variant="ghost" size="xs" className="!p-0 !bg-transparent h-4">
          <RiPencilFill
            className="text-slate-500 hover:text-black dark:hover:text-white"
            size={16}
          />
        </Button>
      </div>
    </div>
  );
}
