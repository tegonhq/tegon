import { capitalizeFirstLetter } from 'common/lib/common';
import type { WorkflowCategoryEnum, WorkflowType } from 'common/types/team';

import { WorkflowItem } from './workflow-item';

interface WorkspaceCategory {
  categoryName: WorkflowCategoryEnum;
  workflows: WorkflowType[];
}

export function WorkflowCategory({
  categoryName,
  workflows,
}: WorkspaceCategory) {
  return (
    <div className="flex flex-col mb-6">
      <div className="flex justify-between items-center w-full mb-2">
        <h3 className="capitalize">{capitalizeFirstLetter(categoryName)}</h3>

        {/* <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <RiAddFill size={16} />
        </Button> */}
      </div>

      {workflows.map((workflow: WorkflowType) => (
        <WorkflowItem key={workflow.name} workflow={workflow} />
      ))}
    </div>
  );
}
