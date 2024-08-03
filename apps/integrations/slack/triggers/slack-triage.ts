import {
  AttachmentResponse,
  IntegrationName,
  LinkedSlackMessageType,
  Settings,
  WebhookPayload,
} from "@tegonhq/types";
import { logger, runs, task, tasks } from "@trigger.dev/sdk/v3";
import { SlashCommandSessionRecord } from "./slack-types";
import {
  convertSlackMessageToTiptapJson,
  getExternalSlackUser,
  getSlackMessage,
  getStateId,
  sendEphemeralMessage,
} from "./slack-utils";
import { getRequest } from "../../integration.utils";

export const slackTraige = task({
  id: "slack-triage",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: async (payload: WebhookPayload) => {
    const { eventBody, integrationAccount, userId, accesstoken } = payload;
    logger.log("check this log");

    const { event, team_id: slackTeamId } = eventBody;
    const { reaction } = event;
    const {
      item: { channel: channelId, ts: threadTs },
      user: slackUserId,
    } = event;

    // Extract Slack settings from the integration account
    const slackSettings = integrationAccount.settings as Settings;
    const {
      Slack: { teamDomain: slackTeamDomain, channelMappings },
    } = slackSettings;

    // Find the channel mapping for the given channel ID
    const channelMapping = channelMappings.find(
      ({ channelId: mappedChannelId }: { channelId: string }) =>
        mappedChannelId === channelId
    );

    // If the reaction is not 'eyes' or the channel mapping doesn't exist, ignore the event
    if (reaction !== "eyes" || !channelMapping) {
      logger.debug(`Ignoring reaction event with reaction: ${reaction}`);
      return undefined;
    }

    if (!channelMapping) {
      logger.debug(`The channel is not connected`);
      return undefined;
    }

    const teamId = channelMapping.teams[0].teamId;

    // Create session data object
    const sessionData: SlashCommandSessionRecord = {
      channelId,
      threadTs,
      slackTeamId,
      slackTeamDomain,
      teamId,
      messagedById: slackUserId,
    };

    logger.debug(`Session data: ${JSON.stringify(sessionData)}`);

    // Get the Slack message using the integration account and session data
    const slackMessageResponse = await getSlackMessage(
      integrationAccount,
      sessionData
    );

    const mainTs = slackMessageResponse.messages[0].thread_ts || threadTs;
    const sourceId = `${channelId}_${mainTs}`;
    let linkedIssue, workflowStates;
    // Check if the thread is already linked to an existing issue
    Promise.all([
      getRequest(
        `${process.env.BACKEND_HOST}/v1/linked_issue/source?sourceId=${sourceId}`,
        { headers: { Authorization: accesstoken } }
      ),
      getRequest(`${process.env.BACKEND_HOST}/v1/workflows?teamId=${teamId}`, {
        headers: { Authorization: accesstoken },
      }),
    ]).then(([linkedIssueResponse, workflowStateResponse]) => {
      linkedIssue = linkedIssueResponse.data;
      workflowStates = workflowStateResponse.data;
    });

    // If the thread is already linked to an issue, send an ephemeral message and return
    if (linkedIssue) {
      await sendEphemeralMessage(
        integrationAccount,
        channelId,
        `This thread is already linked with an existing Issue. so we can't create a new Issue`,
        mainTs,
        slackUserId
      );

      logger.debug(
        `Thread already linked to an existing issue. Skipping issue creation.`
      );
      return undefined;
    }

    const stateId = getStateId("opened", workflowStates);

    // Send an ephemeral message to the user indicating that a new issue is being created
    await sendEphemeralMessage(
      integrationAccount,
      channelId,
      `Creating a New Issue`,
      mainTs,
      slackUserId
    );

    // Get the Slack user details using the integration account and the user ID from the event
    const slackUserResponse = await getExternalSlackUser(
      integrationAccount,
      event.user
    );

    const slackUsername = slackUserResponse.user?.real_name || "Slack";

    // Create source metadata object
    const sourceMetadata = {
      id: integrationAccount.id,
      type: IntegrationName.Slack,
      subType: LinkedSlackMessageType.Thread,
      channelId: sessionData.channelId,
      userDisplayName: slackUsername,
    };

    const attachmentUrls: AttachmentResponse[] = [];
    // add Attachments

    // Convert the Slack message blocks to Tiptap JSON format, including the attachment URLs
    const description = convertSlackMessageToTiptapJson(
      slackMessageResponse.messages[0].blocks,
      attachmentUrls
    );

    const linkIssueData = {
      url: `https://${sessionData.slackTeamDomain}.slack.com/archives/${sessionData.channelId}/p${mainTs.replace(".", "")}`,
      sourceId,
      source: {
        type: IntegrationName.Slack,
        subType: LinkedSlackMessageType.Thread,
      },
      sourceData: {
        channelId: sessionData.channelId,
        parentTs: mainTs,
        slackTeamDomain: sessionData.slackTeamDomain,
      },
      createdById: userId,
    };

    // Create issue input data
    const issueInput = {
      description,
      stateId,
      isBidirectional: true,
      subscriberIds: [...(userId ? [userId] : [])],
      sourceMetadata,
      linkIssueData,
    };

    const handle = await tasks.trigger("slack-issue-create", {
      integrationAccount,
      accesstoken,
      sessionData,
      issueInput,
    });

    const run = await runs.poll(handle.id);
    return run.output;
  },
});
