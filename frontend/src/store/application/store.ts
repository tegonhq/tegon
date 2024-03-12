/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { type IAnyStateTreeNode, type Instance, types } from 'mobx-state-tree';

interface UpdateBody {
  filters: string;
}

export const ApplicationStore: IAnyStateTreeNode = types
  .model({
    filters: types.string,
    identifier: types.string,
  })
  .actions((self) => ({
    update(updateBody: UpdateBody) {
      self.filters = updateBody.filters;

      localStorage.setItem(`filters/${self.identifier}`, updateBody.filters);
    },
  }));

export type ApplicationStoreType = Instance<typeof ApplicationStore>;

export let applicationStore: ApplicationStoreType;

export async function resetApplicationStore() {
  applicationStore = undefined;
}

export async function initApplicationStore(identifier: string) {
  const data = localStorage.getItem(`filters/${identifier}`);

  if (data) {
    applicationStore = ApplicationStore.create({
      filters: data,
      identifier,
    });
  } else {
    applicationStore = ApplicationStore.create({
      filters: JSON.stringify({}),
      identifier,
    });
  }

  return applicationStore;
}
