import { IntegrationName, IssueComment, PrismaClient } from '@prisma/client';
import { logger, task, wait } from '@trigger.dev/sdk/v3';

import {
  IntegrationAccountWithRelations,
  Settings,
} from 'modules/integration-account/integration-account.interface';

import {
  convertSlackMessageToTiptapJson,
  getExternalSlackUser,
} from './slack-utils';
import { SlackPayload } from './slack.interface';
import { EventBody } from '../../integrations-interface';
import { getRequest, getUserId } from '../../integrations-utils';

const prisma = new PrismaClient();
export const slackThread = task({
  id: 'slack-thread',
  run: async (payload: SlackPayload) => {
    const { eventBody, integrationAccount } = payload;
    console.log('check this console log');
    logger.log('check this log', { data: eventBody });
    await wait.for({ seconds: 30 });
    const issueComment = await handleThread(eventBody, integrationAccount);

    return { issueComment };
  },
});

async function handleThread(
  eventBody: EventBody,
  integrationAccount: IntegrationAccountWithRelations,
): Promise<IssueComment> {
  // Get the message from the event body based on the subtype
  const message =
    eventBody.subtype === 'message_changed' ? eventBody.message : eventBody;

  if (message.username && message.username.includes('(via Tegon)')) {
    return undefined;
  }

  // Find the channel mapping in the integration account settings
  const channelMapping = (
    integrationAccount.settings as Settings
  ).Slack.channelMappings.find(
    ({ channelId: mappedChannelId }) => mappedChannelId === eventBody.channel,
  );
  // If no channel mapping is found, return undefined
  if (!channelMapping) {
    return undefined;
  }

  // Generate thread ID and parent thread ID
  const threadId = `${eventBody.channel}_${message.ts}`;
  const parentThreadId = `${eventBody.channel}_${message.thread_ts}`;

  logger.debug(`Handling Slack thread with ID: ${threadId}`);

  logger.log(
    `Hitting this url ${process.env.BACKEND_URL}/v1/linked_issues/source?sourceId=${parentThreadId}`,
  );
  // Get the linked issue by the parent thread ID
  const linkedIssueResponse = await getRequest(
    `${process.env.BACKEND_URL}/v1/linked_issues/source?sourceId=${parentThreadId}`,
    {
      headers: { authorization: `Bearer ${process.env.MASTER_TOKEN}` },
    },
  );

  const linkedIssue = linkedIssueResponse.data;

  // If no linked issue is found, log and return undefined
  if (!linkedIssue) {
    logger.debug(`No linked issue found for Slack issue ID: ${parentThreadId}`);
    return undefined;
  }

  // Extract issue ID and synced comment ID from the linked issue
  const { issueId, source: linkedIssueSource } = linkedIssue;
  const userId = message.user
    ? await getUserId(prisma, { id: message.user })
    : null;
  const parentId = (linkedIssueSource as Record<string, string>)
    .syncedCommentId;

  let displayName;
  if (message.user) {
    // Get the Slack user data if user ID is available
    const userData = await getExternalSlackUser(
      integrationAccount,
      message.user,
    );
    displayName = userData.user.real_name;
  }
  // Prepare source data for the linked comment
  const sourceMetadata = {
    idTs: message.ts,
    parentTs: message.thread_ts,
    channelId: eventBody.channel,
    channelType: eventBody.channel_type,
    type: IntegrationName.Slack,
    id: integrationAccount.id,
    userDisplayName: message.username ? message.username : displayName,
  };

  // Check if a linked comment already exists for the thread ID
  const linkedComment = await prisma.linkedComment.findFirst({
    where: { sourceId: threadId },
    include: { comment: true },
  });

  let attachmentUrls;
  //   if (message.files) {
  //     // Get the files buffer from Slack using the integration account and message files
  //     const multerFiles = await getFilesBuffer(integrationAccount, message.files);

  //     // Upload the files to GCP and get the attachment URLs
  //     attachmentUrls = await this.attachmentService.uploadAttachment(
  //       multerFiles,
  //       userId,
  //       integrationAccount.workspaceId,
  //       sourceMetadata,
  //     );
  //   }

  const tiptapMessage = convertSlackMessageToTiptapJson(
    message.blocks,
    attachmentUrls,
  );

  if (linkedComment) {
    // If a linked comment exists, update the existing comment
    logger.debug(`Updating existing comment for thread ID: ${threadId}`);
    return prisma.issueComment.update({
      where: { id: linkedComment.commentId },
      data: { body: tiptapMessage },
    });
  }

  // If no linked comment exists, create a new comment
  logger.debug(`Creating new comment for thread ID: ${threadId}`);
  return prisma.issueComment.create({
    data: {
      body: tiptapMessage,
      issueId,
      userId,
      parentId,
      sourceMetadata,
      linkedComment: {
        create: {
          url: threadId,
          sourceId: threadId,
          source: { type: IntegrationName.Slack },
          sourceData: sourceMetadata,
        },
      },
    },
  });
}
