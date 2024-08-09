import { AbortTaskRunError, logger, task } from "@trigger.dev/sdk/v3";
import { slackLinkRegex } from "../slack-types";
import {
  createLinkIssueComment,
  getSlackMessage,
  sendSlackMessage,
} from "../slack-utils";
import {
  CreateLinkIssueInput,
  EventBody,
  IntegrationAccount,
  IntegrationInternalInput,
  LinkIssuePayload,
} from "@tegonhq/types";
import { getRequest, postRequest } from "../../../integration.utils";

export const slackLinkIssue = task({
  id: "slack-link-issue",
  run: async (payload: IntegrationInternalInput) => {
    const { payload: linkIssuePayload, accesstoken } = payload;
    const { url, userId, issueId, type } = linkIssuePayload as LinkIssuePayload;
    const match = url.match(slackLinkRegex);

    if (!match) {
      throw new AbortTaskRunError("Slack link didn't match with link regex");
    }

    const [
      ,
      slackTeamDomain,
      channelId,
      messageTimestamp,
      messageTimestampMicro,
      threadTs,
    ] = match;
    const parentTs = `${messageTimestamp}.${messageTimestampMicro}`;
    const messageTs = threadTs ? threadTs.replace("p", "") : parentTs;

    const integrationAccount: IntegrationAccount = (
      await getRequest(
        `${process.env.BACKEND_HOST}/v1/integration_account/settings?path=${["Slack", "channelMappings"]}&searchArray=[{channelId: ${channelId}}]`,
        { headers: { authorization: payload.accesstoken } }
      )
    ).data;

    const subType = integrationAccount ? "Thread" : "Message";

    let message: string;
    if (integrationAccount) {
      const slackMessageResponse = await getSlackMessage(integrationAccount, {
        channelId,
        threadTs,
      });
      message = slackMessageResponse.messages[0].text;
    }

    const linkIssueData: CreateLinkIssueInput = {
      url,
      sourceId: `${channelId}_${parentTs || messageTs}`,
      source: {
        type,
        subType,
      },
      sourceData: {
        channelId,
        messageTs,
        parentTs,
        slackTeamDomain,
        message,
      },
      createdById: userId,
      issueId,
    };

    const linkedIssue = (
      await postRequest(
        `${process.env.BACKEND_HOST}/v1/linked_issues`,
        { headers: { Authorization: accesstoken } },
        linkIssueData
      )
    ).data;

    const {
      issue: { team, number: issueNumber },
    } = linkedIssue;
    const { identifier: teamIdentifier } = team;

    // Create the issue identifier
    const issueIdentifier = `${teamIdentifier}-${issueNumber}`;
    logger.debug(`Sending Slack message for linked issue: ${issueIdentifier}`);

    // Create the issue URL using the workspace slug and issue identifier
    const issueUrl = `${process.env.PUBLIC_FRONTEND_HOST}/${integrationAccount.workspace.slug}/issue/${issueIdentifier}`;

    // Create the message payload with the issue URL and thread details
    const messagePayload: EventBody = {
      channel: channelId,
      blocks: [
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `This thread is linked with a Tegon issue <${issueUrl}|${issueIdentifier}>`,
            },
          ],
        },
      ],
      thread_ts: parentTs,
    };

    // Send the Slack message using the integration account and message payload
    const messageResponse = await sendSlackMessage(
      integrationAccount,
      messagePayload
    );
    logger.debug(
      `Slack message sent successfully for linked issue: ${issueIdentifier}`
    );

    if (messageResponse.ok) {
      const sourceMetadata = {
        id: integrationAccount.id,
        channelId,
        type: "Slack",
      };

      await createLinkIssueComment(
        messageResponse,
        integrationAccount,
        linkIssueData,
        channelId,
        issueId,
        accesstoken,
        sourceMetadata
      );
    }

    return linkedIssue;
  },
});
