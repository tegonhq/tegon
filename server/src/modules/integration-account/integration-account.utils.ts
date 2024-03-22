/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IntegrationName, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  getAccessToken,
  getBotJWTToken,
  getGithubHeaders,
  getGithubSettings,
  getGithubUser,
} from 'modules/integrations/github/github.utils';

import {
  Config,
  IntegrationAccountWithRelations,
} from './integration-account.interface';
import { deleteRequest } from 'modules/integrations/integrations.utils';

export async function storeIntegrationRelatedData(
  prisma: PrismaService,
  integrationAccount: IntegrationAccountWithRelations,
  integrationName: IntegrationName,
  userId: string,
  workspaceId: string,
): Promise<undefined> {
  const integrationConfig =
    integrationAccount.integrationConfiguration as Config;
  switch (integrationName) {
    case IntegrationName.Github:
      const githubSettings = await getGithubSettings(
        integrationAccount,
        integrationConfig.access_token,
      );

      if (githubSettings) {
        await prisma.integrationAccount.update({
          where: { id: integrationAccount.id },
          data: {
            settings: { [IntegrationName.Github]: githubSettings },
          } as unknown as Prisma.JsonObject,
        });
      }

      break;

    case IntegrationName.GithubPersonal:
      const usersonworkspaces = await prisma.usersOnWorkspaces.findUnique({
        where: {
          userId_workspaceId: { userId, workspaceId },
        },
      });

      const accountMapping =
        (usersonworkspaces.externalAccountMappings as Record<string, string>) ||
        {};
      accountMapping[IntegrationName.Github] = integrationAccount.accountId;

      await prisma.usersOnWorkspaces.update({
        where: {
          userId_workspaceId: { userId, workspaceId },
        },
        data: { externalAccountMappings: accountMapping },
      });

      const userData = await getGithubUser(
        await getAccessToken(prisma, integrationAccount),
      );

      await prisma.integrationAccount.update({
        where: { id: integrationAccount.id },
        data: {
          settings: {
            [IntegrationName.GithubPersonal]: { login: userData.login },
          },
        },
      });

      break;

    default:
      return undefined;
  }
}

export async function handleAppDeletion(
  integrationAccount: IntegrationAccountWithRelations,
) {
  const accessToken = await getBotJWTToken(integrationAccount);

  return await deleteRequest(
    `https://api.github.com/app/installations/${integrationAccount.accountId}`,
    getGithubHeaders(accessToken),
  );
}
