/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Config,
  IntegrationAccountWithRelations,
} from 'modules/integration-account/integration-account.interface';

import { postRequest } from '../integrations.utils';

export async function addBotToChannel(
  integrationAccount: IntegrationAccountWithRelations,
  channelId: string,
) {
  const integrationConfig =
    integrationAccount.integrationConfiguration as Config;

  const botResponse = await postRequest(
    'https://slack.com/api/conversations.join',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${integrationConfig.api_key}`,
      },
    },
    { channel: channelId },
  );

  return botResponse.data.ok;
}
