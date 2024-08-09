import { logger, task } from "@trigger.dev/sdk/v3";
import { SlackCreateIssuePayload } from "../slack-types";
import { postRequest } from "../../../integration.utils";
import {
  createLinkIssueComment,
  getIssueMessageModal,
  sendSlackMessage,
} from "../slack-utils";

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

      // Create a comment thread for this Slack thread and Update link issue with synced comment
      await createLinkIssueComment(
        messageResponse,
        integrationAccount,
        issueInput.linkIssueData,
        sessionData.channelId,
        createdIssue.id,
        accesstoken,
        sourceMetadata
      );
    }

    return createdIssue;
  },
});
