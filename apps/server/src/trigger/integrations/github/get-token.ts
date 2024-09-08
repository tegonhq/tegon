import { PrismaClient } from '@prisma/client';

import { getAccessToken, getBotAccessToken } from './utils';

const prisma = new PrismaClient();
export const getToken = async (integrationAccountId: string) => {
  const integrationAccount = await prisma.integrationAccount.findUnique({
    where: {
      id: integrationAccountId,
      deleted: null,
    },
    include: { integrationDefinition: true },
  });

  const token = await getAccessToken(prisma, integrationAccount);
  const botToken = await getBotAccessToken(integrationAccount);

  return { token, botToken };
};
