/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { WorkflowType } from './types/team';

export const Colors = {
  Triage: {
    background: '#FD865C',
    color: '#D94B0E',
  },
  Unscoped: {
    background: '#D9BEFA',
    color: '#9F3DEF',
  },
  Backlog: {
    background: '#A9A67B',
    color: '#8E862C',
  },
  Todo: {
    background: '#D8D8D8',
    color: '#5C5C5C',
  },
  'In Progress': {
    background: '#F2C062',
    color: '#C28C11',
  },
  'In Review': {
    background: '#96C3FE',
    color: '#3F8EF7',
  },
  Done: {
    background: '#3CAF20',
    color: '#79CC68',
  },
  Canceled: {
    background: '#D8D8D8',
    color: '#5C5C5C',
  },
  Duplicate: {
    background: '#D8D8D8',
    color: '#5C5C5C',
  },
};

export function getWorkflowColor(workflow: WorkflowType) {
  return Colors[workflow.name]
    ? Colors[workflow.name]
    : { background: `${workflow.color}99`, color: workflow.color };
}
