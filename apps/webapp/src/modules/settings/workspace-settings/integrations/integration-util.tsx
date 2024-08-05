import type { IntegrationAccountType } from 'common/types';

import { IntegrationName, type IntegrationDefinitionType } from 'common/types';
import React from 'react';

import { useContextStore } from 'store/global-context-provider';

export function useIntegrationAccounts(integrationName: IntegrationName) {
  const {
    integrationDefinitionsStore: { integrationDefinitions },
    integrationAccountsStore: { integrationAccounts },
  } = useContextStore();

  const integrationDefinition = React.useMemo(
    () =>
      integrationDefinitions.find(
        (integrationDefinition: IntegrationDefinitionType) =>
          integrationDefinition.name === integrationName,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [integrationDefinitions],
  );

  const integrationAccountsForName = React.useMemo(
    () =>
      integrationAccounts.filter(
        (integrationAccount: IntegrationAccountType) =>
          integrationAccount.integrationDefinitionId ===
          integrationDefinition.id,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [integrationAccounts],
  );

  return { integrationAccountsForName, integrationDefinition };
}

export function useIntegrationAccount(
  integrationName: IntegrationName,
  userId?: string,
) {
  const {
    integrationDefinitionsStore: { integrationDefinitions },
    integrationAccountsStore: { integrationAccounts },
    integrationAccountsStore,
  } = useContextStore();

  const integrationDefinition = React.useMemo(
    () =>
      integrationDefinitions.find(
        (integrationDefinition: IntegrationDefinitionType) =>
          integrationDefinition.name === integrationName,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [integrationDefinitions],
  );

  const integrationAccount = React.useMemo(
    () =>
      integrationAccounts.find((integrationAccount: IntegrationAccountType) => {
        const userFilter = userId
          ? integrationAccount.integratedById === userId
          : true;

        return (
          integrationAccount.integrationDefinitionId ===
            integrationDefinition.id && userFilter
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [integrationAccounts],
  );

  const iAccount = integrationAccount
    ? integrationAccountsStore.getAccountWithId(integrationAccount.id)
    : undefined;

  return { integrationAccount: iAccount, integrationDefinition };
}
