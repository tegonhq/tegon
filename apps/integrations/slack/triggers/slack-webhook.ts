import { logger, task, tasks } from "@trigger.dev/sdk/v3";
import { IntegrationAccount, Settings, WebhookPayload } from "@tegonhq/types";
import { getRequest } from "../../integration.utils";

export const slackWebhook = task({
  id: "slack-webhook",
  init: async (payload: WebhookPayload) => {
    const {
      team_id: teamId,
      event: { user: slackUserId },
    } = payload.eventBody;
    let integrationAccount: IntegrationAccount;
    let userId: string;
    if (teamId) {
      const integrationAccountResponse = await getRequest(
        `${process.env.BACKEND_HOST}/v1/integration_account/source?accountId=${teamId}`,
        { headers: { authorization: payload.accesstoken } }
      );
      integrationAccount = integrationAccountResponse.data;
      const userIntegrationAccountResponse = await getRequest(
        `${process.env.BACKEND_HOST}/v1/integration_account/source?accountId=${slackUserId}`,
        { headers: { Authorization: payload.accesstoken } }
      );
      userId = userIntegrationAccountResponse.data.integratedById;
    }

    return { integrationAccount, userId };
  },

  run: async (payload: WebhookPayload, { init }) => {
    const { eventBody, eventHeaders, accesstoken } = payload;

    // Check if the event is a URL verification challenge
    if (eventBody.type === "url_verification") {
      logger.log("Responding to Slack URL verification challenge");
      return { challenge: eventBody.challenge };
    }

    const { event, team_id: teamId } = eventBody;

    // If no integration account is found, log and return undefined
    if (!init.integrationAccount) {
      logger.debug("No integration account found for team:", teamId);
      return undefined;
    }

    const slackSettings = init.integrationAccount.settings as Settings;
    // Check if the message is from the bot user
    const isBotMessage = slackSettings.Slack.botUserId === event.user;

    // If the message is from the bot, ignore it
    if (isBotMessage) {
      logger.debug("Ignoring bot message");
      return undefined;
    }

    logger.log("Processing Slack event:", event.type);

    const webhookPayload = {
      eventBody,
      eventHeaders,
      integrationAccount: init.integrationAccount,
      userId: init.userId,
      accesstoken,
    };

    // Handle different event types
    switch (event.type) {
      case "message":
        // Handle thread messages
        tasks.trigger(`slack-thread`, webhookPayload);
        break;
      case "reaction_added":
        // Handle message reactions)
        tasks.trigger(`slack-triage`, webhookPayload);
        break;
      default:
        logger.debug("Unhandled Slack event type:", event.type);
        return undefined;
    }

    return { status: 200 };
  },
});
