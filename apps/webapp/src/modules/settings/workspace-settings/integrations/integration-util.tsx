import type { IntegrationAccount } from '@tegonhq/types';

import { useContextStore } from 'store/global-context-provider';

export function useIntegrationAccount(
  integrationDefinitionId: string,
): IntegrationAccount | undefined {
  const {
    integrationAccountsStore: { integrationAccounts: allIntegrationAccounts },
  } = useContextStore();

  const integrationAccount = allIntegrationAccounts.find(
    (integrationAccount: IntegrationAccount) =>
      integrationAccount.integrationDefinitionId === integrationDefinitionId &&
      integrationAccount.personal === false,
  );

  return integrationAccount;
}
