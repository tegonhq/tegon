/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  types,
  IAnyStateTreeNode,
  Instance,
  applySnapshot,
} from 'mobx-state-tree';
import { useMemo } from 'react';

import { Workspace, WorkspaceStore, workspaceStore } from 'store/workspace';

export interface Global {
  workspace: Workspace;
}

const GlobalStore: IAnyStateTreeNode = types
  .model('GlobalModel', {
    workspace: types.maybe(WorkspaceStore),
  })
  .views(() => ({}));

export type GlobalStoreType = Instance<typeof WorkspaceStore>;

export let globalStore: GlobalStoreType | undefined;

export function initializeStore(snapshot: Global | undefined) {
  const _store =
    globalStore ?? GlobalStore.create({ workspace: workspaceStore });

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
  if (snapshot) {
    applySnapshot(_store, snapshot);
  }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') {
    return _store;
  }
  // Create the store once in the client
  if (!workspaceStore) {
    globalStore = _store;
  }

  return workspaceStore;
}

export function useGlobalStore(initialState: Global | undefined) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

export default GlobalStore;
