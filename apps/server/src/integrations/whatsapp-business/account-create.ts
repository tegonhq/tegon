import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { createIntegrationAccount } from 'integrations/utils';

const prisma = new PrismaClient();

export const integrationCreate = async (
  userId: string,
  workspaceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
) => {
  const { oauthResponse, personal, integrationDefinition, oauthParams } = data;
  const integrationConfiguration = {
    access_token: oauthResponse.access_token,
    access_expires_in: oauthResponse.expires_at,
  };

  const appData = await axios.get(
    `https://graph.facebook.com/v22.0/debug_token?input_token=${oauthParams.code}`,
  );

  const businessManagementScope = appData.data.data.granular_scopes.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (scope: any) => scope.scope === 'whatsapp_business_management',
  );

  const accountId = businessManagementScope?.target_ids[0];

  if (!accountId) {
    throw new Error('No WhatsApp Business Account ID found');
  }

  // Subscribe the app to the WhatsApp Business Account
  await axios.post(
    `https://graph.facebook.com/v22.0/${accountId}/subscribed_apps`,
    {},
    {
      headers: {
        Authorization: `Bearer ${integrationConfiguration.access_token}`,
      },
    },
  );

  // Update the integration account with the new configuration in the database
  const integrationAccount = await createIntegrationAccount(prisma, {
    userId,
    accountId,
    config: integrationConfiguration,
    workspaceId,
    integrationDefinitionId: integrationDefinition.id,
    personal,
  });

  return {
    message: `Created integration account ${integrationAccount.id}`,
  };
};
