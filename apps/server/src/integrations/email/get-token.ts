import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
export const getToken = async (integrationAccountId: string) => {
  const integrationAccount = await prisma.integrationAccount.findUnique({
    where: {
      id: integrationAccountId,
      deleted: null,
    },
    include: { integrationDefinition: true },
  });

  if (!integrationAccount) {
    return null;
  }
  const integrationConfig =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    integrationAccount.integrationConfiguration as any;

  const accessResponse = await axios.post(
    'https://oauth2.googleapis.com/token',
    {
      client_id: integrationAccount.integrationDefinition.clientId,
      client_secret: integrationAccount.integrationDefinition.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: integrationConfig.refreshToken,
      redirect_uri: integrationConfig.redirectUrl,
    },
    { headers: {} },
  );

  return { token: accessResponse.data.access_token };
};
