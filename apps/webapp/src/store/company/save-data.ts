import type { CompanyStoreType } from './store';

import type { SyncActionRecord } from 'common/types';

import { tegonDatabase } from 'store/database';

export async function saveCompanyData(
  data: SyncActionRecord[],
  companyStore: CompanyStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const company = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,

        name: record.data.name,
        domain: record.data.domain,
        website: record.data.website,
        description: record.data.description,
        logo: record.data.logo,
        industry: record.data.industry,
        size: record.data.size,
        type: record.data.type,
        metadata: JSON.stringify(record.data.metadata),
        workspaceId: record.data.workspaceId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.company.put(company);
          return (
            companyStore && (await companyStore.update(company, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.company.put(company);
          return (
            companyStore && (await companyStore.update(company, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.company.delete(record.data.id);
          return (
            companyStore && (await companyStore.deleteById(record.data.id))
          );
        }
      }
    }),
  );
}
