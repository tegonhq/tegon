/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';

import type { IntegrationAccountType } from 'common/types/integration-account';
import {
  IntegrationName,
  type IntegrationDefinitionType,
} from 'common/types/integration-definition';

import { useContextStore } from 'store/global-context-provider';

export function useGithubAccounts(integrationName: IntegrationName) {
  const {
    integrationDefinitionsStore: { integrationDefinitions },
    integrationAccountsStore: { integrationAccounts },
  } = useContextStore();

  const githubDefinition = React.useMemo(
    () =>
      integrationDefinitions.find(
        (integrationDefinition: IntegrationDefinitionType) =>
          integrationDefinition.name === integrationName,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [integrationDefinitions],
  );

  const githubAccounts = React.useMemo(
    () =>
      integrationAccounts.filter(
        (integrationAccount: IntegrationAccountType) =>
          integrationAccount.integrationDefinitionId === githubDefinition.id,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [integrationAccounts],
  );

  return { githubAccounts, githubDefinition };
}
