import type { TeamsStoreType } from './store';

import type { SyncActionRecord } from 'common/types';

import { tegonDatabase } from 'store/database';

export async function saveTeamData(
  data: SyncActionRecord[],
  teamsStore: TeamsStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const team = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        identifier: record.data.identifier,
        workspaceId: record.data.workspaceId,
        preferences: record.data.preferences,
        currentCycle: record.data.currentCycle,
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
          return teamsStore && (await teamsStore.deleteById(record.data.id));
        }
      }
    }),
  );
}
