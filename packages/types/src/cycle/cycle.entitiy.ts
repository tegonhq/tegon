import { CycleHistory } from './cycle-history.entity';
import { JsonValue } from '../common';
import { Issue } from '../issue';
import { Team } from '../team';

export const CycleStatusEnum = {
  UPCOMING: 'UPCOMING',
  CURRENT: 'CURRENT',
  COMPLETED: 'COMPLETED',
};

export type CycleStatusType =
  (typeof CycleStatusEnum)[keyof typeof CycleStatusEnum];

export class Cycle {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  name: string;
  description: string | null;
  number: number;

  team?: Team;
  teamId: string;

  startDate: Date;
  endDate: Date;
  status: CycleStatusType;
  completedAt?: Date;

  history?: CycleHistory[];

  preferences: JsonValue;

  issues?: Issue[];
}
