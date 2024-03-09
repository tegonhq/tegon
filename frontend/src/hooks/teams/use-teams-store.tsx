/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type {
  BootstrapResponse,
  SyncActionRecord,
} from 'common/types/data-loader';

import { tegonDatabase } from 'store/database';
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
          return teamsStore && (await teamsStore.update(team, record.data.id));
        }

        case 'U': {
          await tegonDatabase.teams.put(team);
          return teamsStore && (await teamsStore.update(team, record.data.id));
        }

        case 'D': {
          await tegonDatabase.teams.delete(record.data.id);
          return teamsStore && (await teamsStore.delete(record.data.id));
        }
      }
    }),
  );
}

export function useTeamsStore() {
  return teamsStore;
}
