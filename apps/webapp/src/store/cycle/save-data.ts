import type { CyclesStoreType } from './store';

import type { SyncActionRecord } from 'common/types';

import { tegonDatabase } from 'store/database';

export async function saveCyclesData(
  data: SyncActionRecord[],
  cyclesStore: CyclesStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const cycle = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        teamId: record.data.teamId,
        description: record.data.description,

        startDate: record.data.startDate,
        endDate: record.data.endDate,
        number: record.data.number,

        preferences: JSON.stringify(record.data.preferences),
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.cycles.put(cycle);
          return (
            cyclesStore && (await cyclesStore.update(cycle, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.cycles.put(cycle);
          return (
            cyclesStore && (await cyclesStore.update(cycle, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.cycles.delete(record.data.id);
          return cyclesStore && (await cyclesStore.deleteById(record.data.id));
        }
      }
    }),
  );
}
