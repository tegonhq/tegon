import { WorkflowCategoryEnum } from '@tegonhq/types';
import {
  BacklogLine,
  CanceledLine,
  DoneFill,
  InProgressLine,
  InReviewLine,
  TodoLine,
  TriageFill,
  UnscopedLine,
} from '@tegonhq/ui/icons';

import { type WorkflowType } from './types';

export const WORKFLOW_CATEGORY_ICONS = {
  Backlog: BacklogLine,
  Todo: TodoLine,
  'In Progress': InProgressLine,
  'In Review': InReviewLine,
  Unscoped: UnscopedLine,
  Done: DoneFill,
  Duplicate: CanceledLine,
  Canceled: CanceledLine,
  Triage: TriageFill,
};

export const WORFKLOW_ICON_FOR_CATEGORY = {
  [WorkflowCategoryEnum.TRIAGE]: TriageFill,
  [WorkflowCategoryEnum.BACKLOG]: BacklogLine,
  [WorkflowCategoryEnum.UNSTARTED]: TodoLine,
  [WorkflowCategoryEnum.STARTED]: InReviewLine,
  [WorkflowCategoryEnum.COMPLETED]: BacklogLine,
  [WorkflowCategoryEnum.CANCELED]: CanceledLine,
};

export function getWorkflowIcon(workflow: WorkflowType) {
  if (workflow.name in WORKFLOW_CATEGORY_ICONS) {
    return WORKFLOW_CATEGORY_ICONS[
      workflow.name as keyof typeof WORKFLOW_CATEGORY_ICONS
    ];
  }

  return WORFKLOW_ICON_FOR_CATEGORY[workflow.category as WorkflowCategoryEnum];
}

export function getWorkflowIconForCategory(category: WorkflowCategoryEnum) {
  return WORFKLOW_ICON_FOR_CATEGORY[category];
}
