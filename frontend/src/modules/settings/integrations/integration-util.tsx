/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';

import type { IntegrationAccountType } from 'common/types/integration-account';
import {
  IntegrationName,
  type IntegrationDefinitionType,
} from 'common/types/integration-definition';

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

export function useIntegrationAccount(integrationName: IntegrationName) {
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
      integrationAccounts.find(
        (integrationAccount: IntegrationAccountType) =>
          integrationAccount.integrationDefinitionId ===
          integrationDefinition.id,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [integrationAccounts],
  );

  const iAccount = integrationAccount
    ? integrationAccountsStore.getAccountWithId(integrationAccount.id)
    : undefined;

  return { integrationAccount: iAccount, integrationDefinition };
}
