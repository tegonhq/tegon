/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { useCurrentWorkspace } from 'common/hooks/get-workspace';
import { BootstrapResponse, SyncActionRecord } from 'common/types/data-loader';

import { useBootstrapRecords } from 'services/sync/bootstrap-sync';
import { useDeltaRecords } from 'services/sync/delta-sync';

import { tegonDatabase } from 'store/database';

import { modelName } from './models';
import { workflowStore } from './store';

export async function saveWorkflowData(data: BootstrapResponse) {
  await Promise.all(
    data.syncActions.map(async (record: SyncActionRecord) => {
      return await tegonDatabase.workflow.put({
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        position: record.data.position,
        teamId: record.data.teamId,
        color: record.data.color,
        category: record.data.category,
      });
    }),
  );

  await tegonDatabase.sequence.put({
    id: modelName,
    lastSequenceId: data.lastSequenceId,
  });
}

function onBootstrapRecords(data: BootstrapResponse) {
  saveWorkflowData(data);
}

export function useWorkflowStore() {
  const workspace = useCurrentWorkspace();

  const { refetch: bootstrapWorkflowRecords } = useBootstrapRecords({
    modelName,
    workspaceId: workspace.id,
    onSuccess: onBootstrapRecords,
  });
  const { refetch: syncWorkflowRecords } = useDeltaRecords({
    modelName,
    workspaceId: workspace.id,
    lastSequenceId: workflowStore.lastSequenceId,
    onSuccess: onBootstrapRecords,
  });

  React.useEffect(() => {
    initStore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initStore = async () => {
    if (!workflowStore.lastSequenceId) {
      callBootstrap();
    }

    if (workflowStore.lastSequenceId) {
      callDeltaSync();
    }
  };

  const callBootstrap = React.useCallback(async () => {
    bootstrapWorkflowRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callDeltaSync = React.useCallback(async () => {
    syncWorkflowRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowStore?.lastSequenceId]);

  return workflowStore;
}
