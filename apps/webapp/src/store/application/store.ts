import { type IAnyStateTreeNode, type Instance, types } from 'mobx-state-tree';

import {
  DisplaySettingsModel,
  FiltersModel,
  SilentFiltersModel,
} from './models';
import {
  type UpdateDisplaySettingsBody,
  type UpdateBody,
  type FiltersModelType,
  type DisplaySettingsModelType,
  ViewEnum,
  GroupingEnum,
  OrderingEnum,
  TimeBasedFilterEnum,
} from './types';

export const defaultApplicationStoreValue: {
  filters: FiltersModelType;
  silentFilters: FiltersModelType;
  displaySettings: DisplaySettingsModelType;
  sidebarCollapsed: boolean;
  selectedIssues: string[];
} = {
  filters: {},
  silentFilters: {},
  displaySettings: {
    view: ViewEnum.list,
    grouping: GroupingEnum.status,
    ordering: OrderingEnum.updated_at,
    completedFilter: TimeBasedFilterEnum.All,
    showSubIssues: true,
    showEmptyGroups: false,
  },
  sidebarCollapsed: false,
  selectedIssues: [],
};

export const ApplicationStore: IAnyStateTreeNode = types
  .model({
    filters: FiltersModel,
    silentFilters: SilentFiltersModel,
    displaySettings: DisplaySettingsModel,
    identifier: types.string,
    sidebarCollapsed: types.boolean,
    selectedIssues: types.array(types.string),
    hoverIssue: types.union(types.string, types.undefined),
  })
  .actions((self) => ({
    updateFilters(updateBody: UpdateBody) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentFilters = (self.filters as any).toJSON();

      const toUpdateBody = { ...updateBody };
      const mergedAttributes = {
        ...currentFilters,
        ...toUpdateBody,
      };

      self.filters = FiltersModel.create(mergedAttributes);

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
    updateSilentFilters(updateBody: UpdateBody) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentFilters = (self.silentFilters as any).toJSON();

      const toUpdateBody = { ...updateBody };
      const mergedAttributes = {
        ...currentFilters,
        ...toUpdateBody,
      };

      self.silentFilters = FiltersModel.create(mergedAttributes);
    },
    deleteSilentFilter(filter: keyof FiltersModelType) {
      self.silentFilters[filter] = undefined;
    },
    clearFilters() {
      self.filters = FiltersModel.create({});

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

      self.silentFilters = {};
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
    updateSideBar(collapsed: boolean) {
      self.sidebarCollapsed = collapsed;
    },
  }));

export type ApplicationStoreType = Instance<typeof ApplicationStore>;
