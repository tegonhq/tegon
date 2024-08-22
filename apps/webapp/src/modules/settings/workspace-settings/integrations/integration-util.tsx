import type { IntegrationAccount } from '@tegonhq/types';

import React from 'react';

import { useContextStore } from 'store/global-context-provider';

export function useIntegrationAccount(
  integrationDefinitionId: string,
): IntegrationAccount | undefined {
  const {
    integrationAccountsStore: { integrationAccounts: allIntegrationAccounts },
  } = useContextStore();

  const integrationAccount = React.useMemo(
    () =>
      allIntegrationAccounts.find(
        (integrationAccount: IntegrationAccount) =>
          integrationAccount.integrationDefinitionId ===
            integrationDefinitionId && integrationAccount.personal === false,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allIntegrationAccounts],
  );

  return integrationAccount;
}
