/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { useCurrentWorkspace } from 'common/hooks/get-workspace';
import { BootstrapResponse, SyncActionRecord } from 'common/types/data-loader';

import { useBootstrapRecords } from 'services/sync/bootstrap-sync';
import { useDeltaRecords } from 'services/sync/delta-sync';

import { tegonDatabase } from 'store/database';

import { modelName } from './models';
import { workspaceStore } from './store';

export async function saveWorkspaceData(data: BootstrapResponse) {
  await Promise.all(
    data.syncActions.map(async (record: SyncActionRecord) => {
      const workspace = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        slug: record.data.slug,
      };

      await tegonDatabase.workspace.put(workspace);

      // Update the store
      return await workspaceStore.update(workspace);
    }),
  );

  await tegonDatabase.sequence.put({
    id: modelName,
    lastSequenceId: data.lastSequenceId,
  });
}

function onBootstrapRecords(data: BootstrapResponse) {
  saveWorkspaceData(data);
}

export function useWorkspaceStore() {
  const workspace = useCurrentWorkspace();
  const { refetch: fetchBootstrapRecords } = useBootstrapRecords({
    modelName,
    workspaceId: workspace.id,
    onSuccess: onBootstrapRecords,
  });
  const { refetch: fetchDeltaRecords } = useDeltaRecords({
    modelName,
    workspaceId: workspace.id,
    lastSequenceId: workspaceStore?.lastSequenceId,
    onSuccess: onBootstrapRecords,
  });

  React.useEffect(() => {
    initStore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initStore = async () => {
    if (!workspaceStore.lastSequenceId) {
      callBootstrap();
    }

    if (workspaceStore.lastSequenceId) {
      callDeltaSync();
    }
  };

  const callBootstrap = React.useCallback(async () => {
    fetchBootstrapRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callDeltaSync = React.useCallback(async () => {
    fetchDeltaRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceStore?.lastSequenceId]);

  return workspaceStore;
}
