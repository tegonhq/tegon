import { Workflow } from '@tegonhq/sdk';

export function getStateId(action: string, workflowStates: Workflow[]) {
  const category =
    action === 'opened' ? 'TRIAGE' : action === 'closed' ? 'COMPLETED' : null;
  if (category) {
    const workflow = workflowStates.find(
      (workflow) => workflow.category === category,
    );
    return workflow?.id;
  }

  return undefined;
}
