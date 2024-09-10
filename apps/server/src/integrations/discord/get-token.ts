import { PrismaClient } from '@prisma/client';
import { JsonObject } from '@tegonhq/types';

const prisma = new PrismaClient();
export const getToken = async (integrationAccountId: string) => {
  const integrationAccount = await prisma.integrationAccount.findUnique({
    where: {
      id: integrationAccountId,
      deleted: null,
    },
  });

  const integrationConfig =
    integrationAccount.integrationConfiguration as JsonObject;

  return integrationConfig.api_key;
};
