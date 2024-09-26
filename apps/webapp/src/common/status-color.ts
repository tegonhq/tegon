import type { WorkflowType } from 'common/types';

export function getWorkflowColor(workflow: WorkflowType) {
  return getWorkflowColorWithNumber(workflow.color);
}

export function getWorkflowColorWithNumber(color: string) {
  if (/^#[0-9A-F]{6}[0-9a-f]{0,2}$/i.test(color as string)) {
    return { background: `${color}26`, color };
  }

  const cssVar = `var(--status-pill-${color})`;

  return {
    background: cssVar,
    color: `var(--status-icon-${color})`,
  };
}
