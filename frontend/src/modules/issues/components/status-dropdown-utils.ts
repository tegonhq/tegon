/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { WorkflowType } from 'common/types/team';

export function getDefaultStatus(workflows: WorkflowType[], pathname: string) {
  if (pathname.includes('active')) {
    return workflows.find((workflow: WorkflowType) => workflow.name === 'Todo')
      .id;
  }

  if (pathname.includes('backlog')) {
    return workflows.find(
      (workflow: WorkflowType) => workflow.name === 'Backlog',
    ).id;
  }

  if (pathname.includes('triage')) {
    return workflows.find(
      (workflow: WorkflowType) => workflow.name === 'Triage',
    ).id;
  }

  return workflows.find((workflow: WorkflowType) => workflow.name === 'Backlog')
    .id;
}
