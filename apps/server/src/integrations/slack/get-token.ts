import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getToken = async (integrationAccountId: string) => {
  const integrationAccount = await prisma.integrationAccount.findUnique({
    where: {
      id: integrationAccountId,
      deleted: null,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const integrationConfig = integrationAccount.integrationConfiguration as any;

  return { token: integrationConfig.api_key };
};
