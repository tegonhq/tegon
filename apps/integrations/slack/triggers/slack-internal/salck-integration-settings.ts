import {
  IntegrationAccountSettingsPayload,
  IntegrationInternalInput,
} from "@tegonhq/types";
import { task } from "@trigger.dev/sdk/v3";
import { addBotToChannel, getSlackTeamInfo } from "../slack-utils";
import { postRequest } from "../../../integration.utils";
import { SlackChannel, SlackIntegrationSettings } from "../slack-types";

export const slackIntegrationSettings = task({
  id: "slack-integration-settings",
  run: async (payload: IntegrationInternalInput) => {
    const {
      integrationAccount,
      accesstoken,
      payload: settingsPayload,
    } = payload;

    const { settingsData } =
      settingsPayload as IntegrationAccountSettingsPayload;

    // TODO(Manoj): Fix this type
    const integrationSettings =
      integrationAccount.settings as unknown as SlackIntegrationSettings;
    const channels = integrationSettings.channels || [];

    if (settingsData.incoming_webhook) {
      const newChannel = {
        channelName: settingsData.incoming_webhook.channel.replace(/^#/, ""),
        channelId: settingsData.incoming_webhook.channel_id,
        webhookUrl: settingsData.incoming_webhook.url,
        botJoined: false,
      };

      if (
        !channels.some(
          (channel: SlackChannel) => channel.channelId === newChannel.channelId
        )
      ) {
        const botJoined = await addBotToChannel(
          integrationAccount,
          newChannel.channelId
        );
        newChannel.botJoined = botJoined;
        channels.push(newChannel);
      }
    }

    const slackTeamInfo = await getSlackTeamInfo(
      integrationAccount,
      integrationAccount.accountId
    );

    const settings: SlackIntegrationSettings = {
      teamId: settingsData.team.id as string,
      teamName: settingsData.team.name as string,
      teamDomain: slackTeamInfo.team.domain,
      teamUrl: slackTeamInfo.team.url,
      botUserId: settingsData.bot_user_id,
      channels,
      mappings: integrationSettings.mappings,
    };

    // Update the integration account with the new configuration in the database
    await postRequest(
      `${process.env.BACKEND_HOST}/v1/integration_account/${integrationAccount.id}`,
      { headers: { Authorization: accesstoken } },
      { settings }
    );

    return {
      message: `Updated settings for the integration account id ${integrationAccount.id}`,
    };
  },
});
