/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  IAnyStateTreeNode,
  Instance,
  applySnapshot,
  types,
} from 'mobx-state-tree';
import { useMemo } from 'react';

import { Workspace } from './models';

export const WorkspaceStore: IAnyStateTreeNode = types.model({
  workspace: types.array(Workspace),
  lastSyncId: types.string,
});

export type WorkspaceStoreType = Instance<typeof WorkspaceStore>;

export let workspaceStore: WorkspaceStoreType | undefined;

export function initializeStore(snapshot: typeof Workspace | undefined) {
  const _store =
    workspaceStore ?? WorkspaceStore.create({ workspace: undefined });

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
    workspaceStore = _store;
  }

  return workspaceStore;
}

export function useWorkspaceStore(initialState: typeof Workspace | undefined) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
