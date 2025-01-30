import type { SupportStoreType } from './store';

import type { SyncActionRecord } from 'common/types';

import { tegonDatabase } from 'store/database';

export async function saveSupportData(
  data: SyncActionRecord[],
  supportStore: SupportStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const support = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,

        reportedById: record.data.reportedById,
        actualFrtAt: record.data.actualFrtAt,
        firstResponseAt: record.data.firstResponseAt,
        nextResponseAt: record.data.nextResponseAt,
        resolvedAt: record.data.resolvedAt,
        slaDueBy: record.data.slaDueBy,
        metadata: JSON.stringify(record.data.metadata),
        issueId: record.data.issueId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.support.put(support);
          return (
            supportStore && (await supportStore.update(support, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.support.put(support);
          return (
            supportStore && (await supportStore.update(support, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.support.delete(record.data.id);
          return (
            supportStore && (await supportStore.deleteById(record.data.id))
          );
        }
      }
    }),
  );
}
