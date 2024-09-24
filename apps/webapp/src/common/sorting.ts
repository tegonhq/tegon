import type { WorkflowType } from './types';
import type { WorkflowCategoryEnum } from '@tegonhq/types';

export function workflowSort(
  a: WorkflowType,
  b: WorkflowType,
  categorySequence: WorkflowCategoryEnum[],
): number {
  // Compare categories based on their sequence
  const categoryAIndex = categorySequence.indexOf(
    a.category as WorkflowCategoryEnum,
  );
  const categoryBIndex = categorySequence.indexOf(
    b.category as WorkflowCategoryEnum,
  );
  if (categoryAIndex !== categoryBIndex) {
    return categoryAIndex - categoryBIndex;
  }

  // If categories are the same, compare by position
  return a.position - b.position;
}
