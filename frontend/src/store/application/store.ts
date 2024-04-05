/** Copyright (c) 2024, Tegon, all rights reserved. **/
import type {
  UpdateDisplaySettingsBody,
  UpdateBody,
  FiltersModelType,
} from './types';

import { type IAnyStateTreeNode, type Instance, types } from 'mobx-state-tree';

import { DisplaySettingsModel, FiltersModel } from './models';

export const defaultApplicationStoreValue = {
  filters: {},
  displaySettings: {
    grouping: 'status',
    ordering: 'updated_at',
    showSubIssues: true,
    showEmptyGroups: false,
    showCompletedIssues: true,
    showTriageIssues: false,
    sidebarCollapsed: false,
  },
};

export const ApplicationStore: IAnyStateTreeNode = types
  .model({
    filters: FiltersModel,
    displaySettings: DisplaySettingsModel,
    identifier: types.string,
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
  }));

export type ApplicationStoreType = Instance<typeof ApplicationStore>;
