import { Cycle } from './cycle.entitiy';
import { Issue } from '../issue';

export const CycleHistoryChangeEnum = {
  ADDED: 'ADDED',
  MOVED: 'MOVED',
  UPDATED: 'UPDATED',
  REMOVED: 'REMOVED',
};

export type CycleHistoryChangeType =
  (typeof CycleHistoryChangeEnum)[keyof typeof CycleHistoryChangeEnum];

export class CycleHistory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  userId: string | null;
  cycle: Cycle;
  cycleId: string;

  issueId: string;
  issue: Issue;

  changeType: CycleHistoryChangeType;

  fromStateId: string | null;
  toStateId: string | null;
  fromEstimate: number | null;
  toEstimate: number | null;
}
