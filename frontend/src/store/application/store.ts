/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { type IAnyStateTreeNode, type Instance, types } from 'mobx-state-tree';

interface UpdateBody {
  filters: string;
  workspaceId: string;
  teamIdentifier: string;
}

export const ApplicationStore: IAnyStateTreeNode = types
  .model({
    filters: types.string,
    workspaceId: types.string,
    teamIdentifier: types.string,
  })
  .actions((self) => ({
    update(updateBody: UpdateBody) {
      self.filters = updateBody.filters;
      self.workspaceId = updateBody.workspaceId;
      self.teamIdentifier = updateBody.teamIdentifier;

      localStorage.setItem(
        `filters/${updateBody.workspaceId}/${updateBody.teamIdentifier}`,
        updateBody.filters,
      );
    },
  }));

export type ApplicationStoreType = Instance<typeof ApplicationStore>;

export let applicationStore: ApplicationStoreType;

export async function resetApplicationStore() {
  applicationStore = undefined;
}
