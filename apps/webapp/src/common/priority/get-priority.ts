import { PriorityType } from '@tegonhq/types';

export const Priorities = ['No priority', 'Urgent', 'High', 'Medium', 'Low'];
export const PrioritiesShorthand = ['No priority', 'P0', 'P1', 'P2', 'P3'];

export function getPriorities(type?: PriorityType) {
  if (type && type === PriorityType.ShorthandPriority) {
    return PrioritiesShorthand;
  }

  return Priorities;
}
