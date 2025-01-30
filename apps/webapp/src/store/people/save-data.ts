import type { PeopleStoreType } from './store';

import type { SyncActionRecord } from 'common/types';

import { tegonDatabase } from 'store/database';

export async function savePeopleData(
  data: SyncActionRecord[],
  peopleStore: PeopleStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const people = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,

        name: record.data.name,
        email: record.data.email,
        phone: record.data.phone,
        companyId: record.data.companyId,
        metadata: JSON.stringify(record.data.metadata),
        workspaceId: record.data.workspaceId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.people.put(people);
          return (
            peopleStore && (await peopleStore.update(people, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.people.put(people);
          return (
            peopleStore && (await peopleStore.update(people, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.people.delete(record.data.id);
          return peopleStore && (await peopleStore.deleteById(record.data.id));
        }
      }
    }),
  );
}
