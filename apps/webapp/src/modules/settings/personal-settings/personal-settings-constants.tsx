import { API } from './api';
import { Preferences } from './preferences';
import { Profile } from './profile';
import { Security } from './security';

export const SECTION_COMPONENTS = {
  profile: Profile,
  preferences: Preferences,
  security: Security,
  api: API,
};

export const SECTION_TITLES = {
  profile: 'Profile',
  preferences: 'Preferences',
  security: 'Security',
  api: 'Api',
};

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type SECTION_COMPONENTS_KEYS = StringKeys<typeof SECTION_COMPONENTS>;
