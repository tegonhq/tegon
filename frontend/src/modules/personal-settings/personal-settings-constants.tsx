/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Preferences } from './preferences';
import { Profile } from './profile';

export const SECTION_COMPONENTS = {
  profile: Profile,
  preferences: Preferences,
};

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type SECTION_COMPONENTS_KEYS = StringKeys<typeof SECTION_COMPONENTS>;
