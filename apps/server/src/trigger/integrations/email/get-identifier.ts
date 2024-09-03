import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getIdentifier = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
) => {
  const deliveredTo = data.to;
  const matches = deliveredTo.match(/\+([^-]+)-([^@]+)@/i);
  let workspaceSlug = null;

  if (matches && matches.length === 3) {
    [, workspaceSlug] = matches;
  }

  if (!workspaceSlug) {
    return null;
  }

  // Update the integration account with the new configuration in the database
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: {
      workspace: { slug: workspaceSlug },
      integrationDefinition: { slug: 'email' },
    },
  });

  if (integrationAccount) {
    return integrationAccount.accountId;
  }

  return null;
};
