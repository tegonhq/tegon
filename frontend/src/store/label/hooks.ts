/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { useCurrentWorkspace } from 'common/hooks/get-workspace';
import { BootstrapResponse, SyncActionRecord } from 'common/types/data-loader';

import { useBootstrapRecords } from 'services/sync/bootstrap-sync';
import { useDeltaRecords } from 'services/sync/delta-sync';

import { tegonDatabase } from 'store/database';

import { modelName } from './models';
import { labelStore } from './store';

export async function saveLabelData(data: BootstrapResponse) {
  await Promise.all(
    data.syncActions.map(async (record: SyncActionRecord) => {
      const label = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        color: record.data.color,
        description: record.data.description,
        workspaceId: record.data.workspaceId,
        teamId: record.data.teamId,
        groupId: record.data.groupId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.label.put(label);
          return await labelStore.update(label, record.data.id);
        }

        case 'U': {
          await tegonDatabase.label.put(label);
          return await labelStore.update(label, record.data.id);
        }

        case 'D': {
          await tegonDatabase.label.delete(record.data.id);
          return await labelStore.delete(record.data.id);
        }
      }
    }),
  );

  await tegonDatabase.sequence.put({
    id: modelName,
    lastSequenceId: data.lastSequenceId,
  });
}

function onBootstrapRecords(data: BootstrapResponse) {
  saveLabelData(data);
}

export function useLabelStore() {
  const workspace = useCurrentWorkspace();
  const { refetch: fetchBootstrapRecords } = useBootstrapRecords({
    modelName,
    workspaceId: workspace.id,
    onSuccess: onBootstrapRecords,
  });
  const { refetch: fetchDeltaRecords } = useDeltaRecords({
    modelName,
    workspaceId: workspace.id,
    lastSequenceId: labelStore.lastSequenceId,
    onSuccess: onBootstrapRecords,
  });

  React.useEffect(() => {
    initStore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initStore = async () => {
    if (!labelStore.lastSequenceId) {
      callBootstrap();
    }

    if (labelStore.lastSequenceId) {
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
  }, [labelStore?.lastSequenceId]);

  return labelStore;
}
