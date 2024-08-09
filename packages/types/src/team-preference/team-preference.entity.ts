import { Team } from '../team';

export enum PreferenceEnum {
  ISSUE_ESTIMATES = 'ISSUE_ESTIMATES',
  PRIORITIES = 'PRIORITIES',
}

export const Preference = {
  ISSUE_ESTIMATES: 'ISSUE_ESTIMATES',
  PRIORITIES: 'PRIORITIES',
};

export type Preference = (typeof Preference)[keyof typeof Preference];

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
