/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { types, IAnyStateTreeNode, Instance } from 'mobx-state-tree';
import { createContext, useContext } from 'react';

import { LabelStore } from 'store/label';
import { Workspace, WorkspaceStore } from 'store/workspace';

export interface Global {
  workspace: typeof Workspace;
}

const GlobalStore: IAnyStateTreeNode = types
  .model('GlobalModel', {
    workspace: types.maybe(WorkspaceStore),
    labels: types.maybe(LabelStore),
  })
  .views(() => ({}));

export type GlobalStoreType = Instance<typeof WorkspaceStore>;

export let globalStore: GlobalStoreType | undefined;

const RootStoreContext = createContext<null | GlobalStoreType>(null);

export const Provider = RootStoreContext.Provider;

export function useRootStore() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
}

export default GlobalStore;
