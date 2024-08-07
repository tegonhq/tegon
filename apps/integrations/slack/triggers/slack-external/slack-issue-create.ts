import { logger, task } from "@trigger.dev/sdk/v3";
import { SlackCreateIssuePayload } from "../slack-types";
import { postRequest } from "../../../integration.utils";
import {
  getChannelNameFromIntegrationAccount,
  getIssueMessageModal,
  sendSlackMessage,
} from "../slack-utils";
import { IntegrationName } from "@tegonhq/types";

export const slackIssueCreate = task({
  id: "slack-issue-create",
  run: async (payload: SlackCreateIssuePayload) => {
    const { integrationAccount, sessionData, issueData, accesstoken } = payload;

    // Extract issueInput, sourceMetadata, and userId from issueData
    const { issueInput, sourceMetadata } = issueData;

    logger.info("Creating issue with issueInput", { issueInput });

    const createdIssue = (
      await postRequest(
        `${process.env.BACKEND_HOST}/v1/issues?teamId=${sessionData.teamId}`,
        { headers: { Authorization: accesstoken } },
        { ...issueInput }
      )
    ).data;

    const workspaceId = createdIssue.team.workspaceId;

    logger.info("Issue created successfully", { id: createdIssue.id });
    // Prepare the payload for sending a Slack message
    const messagePayload = {
      channel: sessionData.channelId,
      text: `<@${sessionData.messagedById}> created a Issue`,
      attachments: await getIssueMessageModal(createdIssue, workspaceId),
      ...(sessionData.threadTs ? { thread_ts: sessionData.threadTs } : {}),
    };

    logger.info("Sending Slack message with payload", { messagePayload });

    // Send the Slack message
    const messageResponse = await sendSlackMessage(
      integrationAccount,
      messagePayload
    );

    if (messageResponse.ok) {
      logger.info("Slack message sent successfully", { messageResponse });

      // Extract relevant data from the Slack message event
      const {
        ts: messageTs,
        thread_ts: parentTs,
        channel_type: channelType,
      } = messageResponse.message;

      // Generate the comment body with the Slack channel name
      const commentBody = `${IntegrationName.Slack} thread in #${getChannelNameFromIntegrationAccount(integrationAccount, sessionData.channelId)}`;
      const commentSourceMetadata = {
        ...sourceMetadata,
        parentTs,
        idTs: messageTs,
        channelType,
      };

      const issueComment =
        (
          await postRequest(
            `${process.env.BACKEND_HOST}/v1/issue_comments?issueId=${createdIssue.id}`,
            { headers: { Authorization: accesstoken } },
            { body: commentBody, sourceMetadata: commentSourceMetadata }
          )
        ).data || null;
      logger.info("Issue comment created successfully", { issueComment });

      issueInput.linkIssueData.source.syncedCommentId = issueComment.id;
      issueInput.linkIssueData.sourceData.messageTs = messageTs;

      await postRequest(
        `${process.env.BACKEND_HOST}/v1/linked_issues/source/${issueInput.linkIssueData.sourceId}`,
        { headers: { Authorization: accesstoken } },
        {
          sourceData: issueInput.linkIssueData.sourceData,
          source: issueInput.linkIssueData.source,
        }
      );

      logger.info("Linked issue updated successfully");
    }

    return createdIssue;
  },
});
