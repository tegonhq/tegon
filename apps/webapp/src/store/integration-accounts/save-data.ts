import type { IntegrationAccountsStoreType } from './store';

import type { SyncActionRecord } from 'common/types';

import { tegonDatabase } from 'store/database';

export async function saveIntegrationAccountData(
  data: SyncActionRecord[],
  integrationAccountsStore: IntegrationAccountsStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const integrationAccount = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        accountId: record.data.accountId,
        settings: JSON.stringify(record.data.settings),
        integratedById: record.data.integratedById,
        integrationDefinitionId: record.data.integrationDefinitionId,
        workspaceId: record.data.workspaceId,
        personal: record.data.personal,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.integrationAccounts.put(integrationAccount);
          return (
            integrationAccountsStore &&
            (await integrationAccountsStore.update(
              integrationAccount,
              record.data.id,
            ))
          );
        }

        case 'U': {
          await tegonDatabase.integrationAccounts.put(integrationAccount);
          return (
            integrationAccountsStore &&
            (await integrationAccountsStore.update(
              integrationAccount,
              record.data.id,
            ))
          );
        }

        case 'D': {
          await tegonDatabase.integrationAccounts.delete(record.data.id);
          return (
            integrationAccountsStore &&
            (await integrationAccountsStore.deleteById(record.data.id))
          );
        }
      }
    }),
  );
}
