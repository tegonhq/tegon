import type { WorkflowType } from '@tegonhq/types';

export const WorkflowColors = {
  Triage: {
    background: 'var(--status-pill-0)',
    color: 'var(--status-icon-0)',
  },
  Unscoped: {
    background: 'var(--status-pill-1)',
    color: 'var(--status-icon-1)',
  },
  Backlog: {
    background: 'var(--status-pill-2)',
    color: 'var(--status-icon-2)',
  },
  Todo: {
    background: 'var(--status-pill-3)',
    color: 'var(--status-icon-3)',
  },
  'In Progress': {
    background: 'var(--status-pill-4)',
    color: 'var(--status-icon-4)',
  },
  'In Review': {
    background: 'var(--status-pill-5)',
    color: 'var(--status-icon-5)',
  },
  Done: {
    background: 'var(--status-pill-6)',
    color: 'var(--status-icon-6)',
  },
  Canceled: {
    background: 'var(--status-pill-3)',
    color: 'var(--status-icon-3)',
  },
  Duplicate: {
    background: 'var(--status-pill-3)',
    color: 'var(--status-icon-3)',
  },
};

export function getWorkflowColor(workflow: WorkflowType) {
  return WorkflowColors[workflow.name]
    ? WorkflowColors[workflow.name]
    : { background: `${workflow.color}99`, color: workflow.color };
}
