import { Team } from '../team';

export enum Preference {
  ISSUE_ESTIMATES = 'ISSUE_ESTIMATES',
  PRIORITIES = 'PRIORITIES',
}

export class TeamPreference {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  team?: Team | null;
  teamId: string | null;
  preference: Preference;
  value: string;
}
