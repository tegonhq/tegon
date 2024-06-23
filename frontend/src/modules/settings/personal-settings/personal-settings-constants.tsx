/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Preferences } from './preferences';
import { Profile } from './profile';
import { Security } from './security';

export const SECTION_COMPONENTS = {
  profile: Profile,
  preferences: Preferences,
  security: Security,
};

export const SECTION_TITLES = {
  profile: 'Profile',
  preferences: 'Preferences',
  security: 'Security',
};

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type SECTION_COMPONENTS_KEYS = StringKeys<typeof SECTION_COMPONENTS>;
