import { Labels } from './labels';
import { Members } from './members';
import { Overview } from './overview';
import { Templates } from './templates';
import { Workflow } from './workflow';

export const SECTION_COMPONENTS = {
  overview: Overview,
  workflow: Workflow,
  labels: Labels,
  members: Members,
  templates: Templates,
};

export const SECTION_TITLES = {
  overview: 'Overview',
  workflow: 'Workflow',
  labels: 'Labels',
  members: 'Members',
  templates: 'Templates',
};

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type SECTION_COMPONENTS_KEYS = StringKeys<typeof SECTION_COMPONENTS>;
