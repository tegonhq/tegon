import { IntegrationName, type IntegrationDefinitionType } from 'common/types';
import React from 'react';

import { useContextStore } from 'store/global-context-provider';

export function useGithubAccounts(integrationName: IntegrationName) {
  const {
    integrationDefinitionsStore: { integrationDefinitions },

    integrationAccountsStore,
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

  const githubAccounts =
    integrationAccountsStore.getAccountForIntegrationDefinition(
      githubDefinition.id,
    );

  return { githubAccounts, githubDefinition };
}
