/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { types } from 'mobx-state-tree';

export const Team = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  name: types.string,
  identifier: types.string,
});

export const Teams = types.array(Team);
