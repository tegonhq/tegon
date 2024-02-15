/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { useCurrentWorkspace } from 'common/hooks/get-workspace';
import { BootstrapResponse, SyncActionRecord } from 'common/types/data-loader';

import { tegonDatabase } from 'store/database';

import { initializeWorkspaceStore, workspaceStore } from './store';

export async function saveWorkspaceData(data: BootstrapResponse) {
  await Promise.all(
    data.syncActions.map(async (record: SyncActionRecord) => {
      return await tegonDatabase.workspace.put({
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        slug: record.data.slug,
      });
    }),
  );

  await tegonDatabase.sequence.put({
    id: 'workspace',
    lastSequenceId: data.lastSequenceId,
  });
}

export function useWorkspaceStore() {
  const workspace = useCurrentWorkspace();

  React.useEffect(() => {
    initStore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initStore = async () => {
    const workspaceData = await tegonDatabase.workspace.get({
      id: workspace.id,
    });
    const lastSequenceData = await tegonDatabase.sequence.get({
      id: 'workspace',
    });
    initializeWorkspaceStore(workspaceData, lastSequenceData?.lastSequenceId);

    if (!lastSequenceData) {
      callBootstrap();
    }

    if (lastSequenceData?.lastSequenceId) {
      callDeltaSync();
    }
  };

  const callBootstrap = React.useCallback(async () => {
    const response = await fetch(
      `/api/v1/sync_actions/bootstrap?workspaceId=${workspace.id}&modelName=Workspace`,
    );
    const bootstrapData = await response.json();
    await saveWorkspaceData(bootstrapData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callDeltaSync = React.useCallback(async () => {
    const response = await fetch(
      `/api/v1/sync_actions/delta?workspaceId=${workspace.id}&modelName=Workspace&lastSequenceId=${workspaceStore.lastSequenceId}`,
    );
    const deltaSyncData = await response.json();

    await saveWorkspaceData(deltaSyncData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceStore?.lastSequenceId]);

  return workspaceStore;
}
