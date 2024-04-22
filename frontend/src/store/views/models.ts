/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { types } from 'mobx-state-tree';

import { FiltersModel } from 'store/application/models';

export const View = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  name: types.string,
  description: types.string,
  filters: FiltersModel,
  isFavorite: types.boolean,
  workspaceId: types.string,
});

export const Views = types.array(View);
