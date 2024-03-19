/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { types } from 'mobx-state-tree';

export const Workflow = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  name: types.string,
  position: types.number,
  color: types.string,
  category: types.enumeration([
    'BACKLOG',
    'UNSTARTED',
    'STARTED',
    'COMPLETED',
    'CANCELED',
    'TRIAGE',
  ]),
  teamId: types.string,
});

export const modelName = 'Workflow';
