import { WorkflowCategory } from '@tegonhq/types';

import type { WorkflowType } from 'common/types';

export function getBacklogWorkflow(workflows: WorkflowType[]) {
  const findBacklog = workflows.find((workflow) =>
    workflow.name.toLowerCase().includes('backlog'),
  );

  if (findBacklog) {
    return findBacklog;
  }

  return workflows.find(
    (workflow) => workflow.category === WorkflowCategory.BACKLOG,
  );
}
