/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { type IAnyStateTreeNode, type Instance, types } from 'mobx-state-tree';

interface UpdateBody {
  filters: string;
}

interface UpdateDisplaySettingsBody {
  grouping?: string;
  showSubIssues?: boolean;
  showEmptyGroups?: boolean;
}

export const ApplicationStore: IAnyStateTreeNode = types
  .model({
    filters: types.string,
    displaySettings: types.model({
      grouping: types.string,
      showSubIssues: types.boolean,
      showEmptyGroups: types.boolean,
    }),
    identifier: types.string,
  })
  .actions((self) => ({
    update(updateBody: UpdateBody) {
      self.filters = updateBody.filters;

      localStorage.setItem(`filters/${self.identifier}`, updateBody.filters);
    },
    updateDisplaySettings(updateBody: UpdateDisplaySettingsBody) {
      self.displaySettings = { ...self.displaySettings, ...updateBody };
    },
    load(identifier: string, defaultFilters: string) {
      const data = localStorage.getItem(`filters/${identifier}`);

      if (data) {
        self.filters = data;
        self.identifier = identifier;
      } else {
        self.filters = JSON.stringify(defaultFilters ? defaultFilters : {});
        self.identifier = identifier;
      }
    },
  }));

export type ApplicationStoreType = Instance<typeof ApplicationStore>;
