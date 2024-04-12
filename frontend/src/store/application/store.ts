/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { type IAnyStateTreeNode, type Instance, types } from 'mobx-state-tree';

import { DisplaySettingsModel, FiltersModel } from './models';
import {
  type UpdateDisplaySettingsBody,
  type UpdateBody,
  type FiltersModelType,
  type DisplaySettingsModelType,
  ViewEnum,
  GroupingEnum,
  OrderingEnum,
} from './types';

export const defaultApplicationStoreValue: {
  filters: FiltersModelType;
  displaySettings: DisplaySettingsModelType;
  selectedIssues: string[];
} = {
  filters: {},
  displaySettings: {
    view: ViewEnum.list,
    grouping: GroupingEnum.status,
    ordering: OrderingEnum.updated_at,
    showSubIssues: true,
    showEmptyGroups: false,
    showCompletedIssues: true,
    showTriageIssues: false,
    sidebarCollapsed: false,
  },
  selectedIssues: [],
};

export const ApplicationStore: IAnyStateTreeNode = types
  .model({
    filters: FiltersModel,
    displaySettings: DisplaySettingsModel,
    identifier: types.string,
    selectedIssues: types.array(types.string),
    hoverIssue: types.union(types.string, types.undefined),
  })
  .actions((self) => ({
    updateFilters(updateBody: UpdateBody) {
      self.filters = FiltersModel.create({ ...self.filters, ...updateBody });

      localStorage.setItem(
        `filters/${self.identifier}`,
        JSON.stringify(self.filters),
      );
    },
    deleteFilter(filter: keyof FiltersModelType) {
      self.filters[filter] = undefined;

      localStorage.setItem(
        `filters/${self.identifier}`,
        JSON.stringify(self.filters),
      );
    },
    updateDisplaySettings(updateBody: UpdateDisplaySettingsBody) {
      self.displaySettings = { ...self.displaySettings, ...updateBody };

      localStorage.setItem(
        `display/${self.identifier}`,
        JSON.stringify(self.displaySettings),
      );
    },
    load(identifier: string) {
      const data = localStorage.getItem(`filters/${identifier}`);

      const displayData = localStorage.getItem(`display/${identifier}`)
        ? JSON.parse(localStorage.getItem(`display/${identifier}`))
        : defaultApplicationStoreValue.displaySettings;

      self.identifier = identifier;
      self.filters = data ? JSON.parse(data) : {};
      self.displaySettings =
        Object.keys(displayData).length > 0
          ? displayData
          : defaultApplicationStoreValue.displaySettings;
    },
    addToSelectedIssues(issue: string, reset: boolean) {
      if (reset) {
        self.selectedIssues.replace([issue]);
      } else {
        self.selectedIssues.push(issue);
      }

      self.hoverIssue = undefined;
    },
    removeSelectedIssue(issue: string) {
      if (self.selectedIssues.length === 1) {
        self.selectedIssues.replace([]);
      } else {
        const index = self.selectedIssues.indexOf(issue);
        self.selectedIssues.splice(index, 1);
      }
    },
    clearSelectedIssues() {
      self.hoverIssue = undefined;
    },
    setHoverIssue(issue: string) {
      self.hoverIssue = issue;
    },
  }));

export type ApplicationStoreType = Instance<typeof ApplicationStore>;
