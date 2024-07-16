import { IntegrationName, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  getAccessToken,
  getBotJWTToken,
  getGithubHeaders,
  getGithubSettings,
  getGithubUser,
} from 'modules/integrations/github/github.utils';
import { deleteRequest } from 'modules/integrations/integrations.utils';
import {
  addBotToChannel,
  getSlackTeamInfo,
} from 'modules/integrations/slack/slack.utils';

import {
  ChannelMapping,
  Config,
  IntegrationAccountWithRelations,
  Settings,
} from './integration-account.interface';

export async function storeIntegrationRelatedData(
  prisma: PrismaService,
  integrationAccount: IntegrationAccountWithRelations,
  integrationName: IntegrationName,
  userId: string,
  workspaceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settingsData?: Record<string, any>,
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

    case IntegrationName.Slack:
      const integrationSettings = integrationAccount.settings as Settings;
      const channelMappings =
        integrationSettings?.Slack.channelMappings || ([] as ChannelMapping[]);

      if (settingsData.incoming_webhook) {
        const newChannelMapping: ChannelMapping = {
          channelName: settingsData.incoming_webhook.channel.replace(/^#/, ''),
          channelId: settingsData.incoming_webhook.channel_id,
          webhookUrl: settingsData.incoming_webhook.url,
          botJoined: false,
        };

        if (
          !channelMappings.some(
            (mapping: ChannelMapping) =>
              mapping.channelId === newChannelMapping.channelId,
          )
        ) {
          const botJoined = await addBotToChannel(
            integrationAccount,
            newChannelMapping.channelId,
          );
          newChannelMapping.botJoined = botJoined;
          channelMappings.push(newChannelMapping);
        }
      }

      const slackTeamInfo = await getSlackTeamInfo(
        integrationAccount,
        integrationAccount.accountId,
      );

      await prisma.integrationAccount.update({
        where: { id: integrationAccount.id },
        data: {
          settings: {
            [IntegrationName.Slack]: {
              teamId: settingsData.team.id as string,
              teamName: settingsData.team.name as string,
              teamDomain: slackTeamInfo.team.domain,
              teamUrl: slackTeamInfo.team.url,
              botUserId: settingsData.bot_user_id,
              channelMappings: channelMappings as ChannelMapping[],
            },
          } as unknown as Prisma.JsonValue,
        },
      });
      break;

    case IntegrationName.SlackPersonal:
      const slackUsersOnWorkspace = await prisma.usersOnWorkspaces.findUnique({
        where: {
          userId_workspaceId: { userId, workspaceId },
        },
      });

      const externalAccountMappings =
        (slackUsersOnWorkspace.externalAccountMappings as Record<
          string,
          string
        >) || {};
      externalAccountMappings[IntegrationName.Slack] =
        integrationAccount.accountId;

      await prisma.usersOnWorkspaces.update({
        where: {
          userId_workspaceId: { userId, workspaceId },
        },
        data: { externalAccountMappings },
      });

      break;

    case IntegrationName.Sentry:
      await prisma.integrationAccount.update({
        where: { id: integrationAccount.id },
        data: {
          settings: settingsData,
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
  if (
    integrationAccount.integrationDefinition.name === IntegrationName.Github
  ) {
    const accessToken = await getBotJWTToken(integrationAccount);

    return await deleteRequest(
      `https://api.github.com/app/installations/${integrationAccount.accountId}`,
      getGithubHeaders(accessToken),
    );
  }

  return undefined;
}
