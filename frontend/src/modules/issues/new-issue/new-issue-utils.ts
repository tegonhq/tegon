/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type {
  IntegrationAccountType,
  Settings,
} from 'common/types/integration-account';

export function isBirectionalEnabled(githubAccounts: IntegrationAccountType[]) {
  let isBirectionalEnabled = false;

  githubAccounts.forEach((githubAccount: IntegrationAccountType) => {
    const settings: Settings = JSON.parse(githubAccount.settings);

    settings.Github.repositoryMappings.forEach((mapping) => {
      if (mapping.bidirectional) {
        isBirectionalEnabled = true;
      }
    });
  });

  return isBirectionalEnabled;
}
