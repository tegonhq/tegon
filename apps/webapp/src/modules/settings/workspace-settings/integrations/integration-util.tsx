import type { IntegrationAccount } from '@tegonhq/types';

import React from 'react';

import { useContextStore } from 'store/global-context-provider';
import { UserContext } from 'store/user-context';

export function useIntegrationAccount(
  integrationDefinitionId: string,
  personal: boolean = false,
): IntegrationAccount | undefined {
  const {
    integrationAccountsStore: { integrationAccounts: allIntegrationAccounts },
  } = useContextStore();

  const currentUser = React.useContext(UserContext);

  const integrationAccount = allIntegrationAccounts.find(
    (integrationAccount: IntegrationAccount) => {
      const isPersonal = personal
        ? integrationAccount.integratedById === currentUser.id
        : true;

      return (
        integrationAccount.integrationDefinitionId ===
          integrationDefinitionId &&
        integrationAccount.personal === personal &&
        isPersonal
      );
    },
  );

  return integrationAccount;
}
