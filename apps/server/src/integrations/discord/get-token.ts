import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getToken = async (integrationAccountId: string) => {
  const integrationAccount = await prisma.integrationAccount.findUnique({
    where: {
      id: integrationAccountId,
      deleted: null,
    },
    include: { integrationDefinition: true },
  });

  const definitionConfig =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    integrationAccount.integrationDefinition.config as any;

  return { token: definitionConfig.botToken };
};
