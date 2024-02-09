/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  IAnyStateTreeNode,
  Instance,
  applySnapshot,
  types,
} from 'mobx-state-tree';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { WorkspaceType } from 'common/types/workspace';

import { tegonDatabase } from 'store/database';

import { Workspace } from './models';

export const WorkspaceStore: IAnyStateTreeNode = types
  .model({
    workspace: types.union(Workspace, types.undefined),
    lastSyncId: types.union(types.number, types.undefined),
  })
  .actions((self) => ({
    updateWorkspace(workspace: WorkspaceType) {
      self.workspace = workspace;
    },
  }));

export type WorkspaceStoreType = Instance<typeof WorkspaceStore>;

export let workspaceStore: WorkspaceStoreType | undefined;

export function initializeWorkspaceStore(workspace: WorkspaceType | undefined) {
  const _store = workspaceStore ?? WorkspaceStore.create({ workspace });

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
  if (workspace) {
    applySnapshot(_store, { workspace });
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

export function useWorkspaceStore() {
  const {
    query: { workspaceSlug },
  } = useRouter();

  const [isLoading, setLoading] = useState(workspaceStore ? false : true);
  const [store, setStore] = useState(workspaceStore);

  useEffect(() => {
    if (workspaceSlug && !workspaceStore) {
      setLoading(true);

      tegonDatabase.workspace
        .get({ slug: workspaceSlug as string })
        .then((workspace) => {
          setStore(initializeWorkspaceStore(workspace));
          setLoading(false);
        });
    }
  }, [workspaceSlug]);

  return { store, isLoading };
}

// Expose Models also
export * from './models';
