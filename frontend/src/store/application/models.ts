/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { types } from 'mobx-state-tree';

export const FilterModel = types.model({
  value: types.union(types.array(types.string), types.array(types.number)),
  filterType: types.enumeration([
    'IS',
    'IS_NOT',
    'INCLUDES',
    'INCLUDES_ANY',
    'EXCLUDES',
    'EXCLUDES_ANY',
  ]),
});

export const FilterBooleanModel = types.model({
  filterType: types.enumeration([
    'IS',
    'IS_NOT',
    'INCLUDES',
    'INCLUDES_ANY',
    'EXCLUDES',
    'EXCLUDES_ANY',
  ]),
});

export const FiltersModel = types.model({
  assignee: types.union(types.undefined, FilterModel),
  status: types.union(types.undefined, FilterModel),
  label: types.union(types.undefined, FilterModel),
  priority: types.union(types.undefined, FilterModel),

  // For issues coming from Slack, Github
  source: types.union(types.undefined, FilterModel),

  isParent: types.union(types.undefined, FilterBooleanModel),
  isSubIssue: types.union(types.undefined, FilterBooleanModel),
  isBlocked: types.union(types.undefined, FilterBooleanModel),
  isBlocking: types.union(types.undefined, FilterBooleanModel),
});

export const DisplaySettingsModel = types.model({
  view: types.enumeration(['list', 'board']),
  grouping: types.enumeration(['assignee', 'priority', 'status', 'label']),
  ordering: types.enumeration([
    'assignee',
    'priority',
    'status',
    'created_at',
    'updated_at',
  ]),
  showSubIssues: types.boolean,
  showEmptyGroups: types.boolean,
  showTriageIssues: types.boolean,
  showCompletedIssues: types.boolean,
});
