/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { useCurrentWorkspace } from 'hooks/use-current-workspace';
import { BootstrapResponse, SyncActionRecord } from 'common/types/data-loader';

import { useBootstrapRecords } from 'services/sync/bootstrap-sync';
import { useDeltaRecords } from 'services/sync/delta-sync';

import { tegonDatabase } from 'store/database';

import { modelName } from './models';
import { teamStore } from './store';

export async function saveTeamData(data: BootstrapResponse) {
  await Promise.all(
    data.syncActions.map(async (record: SyncActionRecord) => {
      const team = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        identifier: record.data.identifier,
        workspaceId: record.data.workspaceId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.teams.put(team);
          return await teamStore.update(team, record.data.id);
        }

        case 'U': {
          await tegonDatabase.teams.put(team);
          return await teamStore.update(team, record.data.id);
        }

        case 'D': {
          await tegonDatabase.teams.delete(record.data.id);
          return await teamStore.delete(record.data.id);
        }
      }
    }),
  );

  await tegonDatabase.sequences.put({
    id: modelName,
    lastSequenceId: data.lastSequenceId,
  });
}

function onBootstrapRecords(data: BootstrapResponse) {
  saveTeamData(data);
}

export function useTeamStore() {
  const workspace = useCurrentWorkspace();
  const { refetch: bootstrapTeamRecords } = useBootstrapRecords({
    modelName,
    workspaceId: workspace.id,
    onSuccess: onBootstrapRecords,
  });
  const { refetch: syncTeamRecords } = useDeltaRecords({
    modelName,
    workspaceId: workspace.id,
    lastSequenceId: teamStore.lastSequenceId,
    onSuccess: onBootstrapRecords,
  });

  React.useEffect(() => {
    initStore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initStore = async () => {
    if (!teamStore.lastSequenceId) {
      callBootstrap();
    }

    if (teamStore.lastSequenceId) {
      callDeltaSync();
    }
  };

  const callBootstrap = React.useCallback(async () => {
    bootstrapTeamRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callDeltaSync = React.useCallback(async () => {
    syncTeamRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamStore?.lastSequenceId]);

  return teamStore;
}
