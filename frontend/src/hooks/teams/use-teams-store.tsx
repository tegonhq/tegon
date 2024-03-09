/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type {
  BootstrapResponse,
  SyncActionRecord,
} from 'common/types/data-loader';

import { useStoreManagement } from 'hooks/use-store-management';

import { tegonDatabase } from 'store/database';
import { MODELS } from 'store/models';
import { teamsStore } from 'store/teams';

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
          return await teamsStore.update(team, record.data.id);
        }

        case 'U': {
          await tegonDatabase.teams.put(team);
          return await teamsStore.update(team, record.data.id);
        }

        case 'D': {
          await tegonDatabase.teams.delete(record.data.id);
          return await teamsStore.delete(record.data.id);
        }
      }
    }),
  );

  await tegonDatabase.sequences.put({
    id: MODELS.Team,
    lastSequenceId: data.lastSequenceId,
  });
}

export function useTeamsStore() {
  return useStoreManagement({
    modelName: MODELS.Team,
    onSaveData: saveTeamData,
    store: teamsStore,
  });
}
