import { CreateNewTeam } from './create-new-team';
import { Export } from './export';
import { Labels } from './labels';
import { Members } from './members';
import { Overview } from './overview';

export const SECTION_COMPONENTS = {
  overview: Overview,
  labels: Labels,
  members: Members,
  new_team: CreateNewTeam,
  export: Export,
};

export const SECTION_TITLES = {
  overview: 'Overview',
  labels: 'Labels',
  members: 'Members',
  new_team: 'Add team',
  export: 'Export',
};

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type SECTION_COMPONENTS_KEYS = StringKeys<typeof SECTION_COMPONENTS>;
