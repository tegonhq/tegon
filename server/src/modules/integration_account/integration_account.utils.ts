/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IntegrationAccount, IntegrationName } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  getAccessToken,
  getGithubSettings,
  getGithubUser,
} from 'modules/integrations/github/github.utils';

import { Config } from './integration_account.interface';

export async function storeIntegrationRelatedData(
  prisma: PrismaService,
  integrationAccount: IntegrationAccount,
  integrationName: IntegrationName,
  userId: string,
  workspaceId: string,
): Promise<undefined> {
  const integrationConfig =
    integrationAccount.integrationConfiguration as Config;
  console.log();
  switch (integrationName) {
    case IntegrationName.Github:
      const githubSettings = await getGithubSettings(
        integrationAccount.accountId,
        integrationConfig.access_token,
      );

      if (githubSettings) {
        await prisma.integrationAccount.update({
          where: { id: integrationAccount.id },
          data: { settings: { [IntegrationName.Github]: githubSettings } },
        });
      }

      break;

    case IntegrationName.GithubPersonal:
      const usersonworkspaces = await prisma.usersOnWorkspaces.findUnique({
        where: {
          userId_workspaceId: { userId, workspaceId },
        },
      });

      let accountMapping =
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
