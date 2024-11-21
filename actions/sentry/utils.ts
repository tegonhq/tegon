import { IntegrationAccount, JsonObject } from '@tegonhq/sdk';

export function getSentryHeaders(integrationAccount: IntegrationAccount) {
  const integrationConfig =
    integrationAccount.integrationConfiguration as JsonObject;

  return {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${integrationConfig.token}`,
    },
  };
}
