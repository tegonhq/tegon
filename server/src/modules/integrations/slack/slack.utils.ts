/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Logger } from '@nestjs/common';
import { IntegrationAccount, IntegrationName } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  ChannelTeamMapping,
  Config,
  IntegrationAccountWithRelations,
  Settings,
} from 'modules/integration-account/integration-account.interface';
import {
  IssueCommentAction,
  IssueCommentWithRelations,
} from 'modules/issue-comments/issue-comments.interface';
import {
  IssueWithRelations,
  UpdateIssueInput,
} from 'modules/issues/issues.interface';
import {
  LinkedIssueSourceData,
  LinkedIssueWithRelations,
} from 'modules/linked-issue/linked-issue.interface';

import {
  ModalType,
  ModelViewType,
  SlashCommandSessionRecord,
  slackIssueData,
} from './slack.interface';
import { EventBody } from '../integrations.interface';
import { getRequest, getUserId, postRequest } from '../integrations.utils';

export function getSlackHeaders(
  integrationAccount: IntegrationAccountWithRelations,
) {
  const integrationConfig =
    integrationAccount.integrationConfiguration as Config;
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${integrationConfig.api_key}`,
    },
  };
}

export async function addBotToChannel(
  integrationAccount: IntegrationAccountWithRelations,
  channelId: string,
) {
  const botResponse = await postRequest(
    'https://slack.com/api/conversations.join',
    getSlackHeaders(integrationAccount),
    { channel: channelId },
  );

  return botResponse.data.ok;
}

function createBlocks(
  team: ChannelTeamMapping,
  containsDescription: boolean,
  sessionData: SlashCommandSessionRecord,
) {
  return [
    {
      type: 'input',
      block_id: team.teamId,
      dispatch_action: true,
      optional: true,
      element: {
        type: 'static_select',
        placeholder: {
          type: 'plain_text',
          text: 'Select an option',
        },
        options: [
          {
            text: {
              type: 'plain_text',
              text: 'Generic Issue',
            },
            value: 'generic_issue',
          },
        ],
        action_id: `${team.teamId}_action`,
      },
      label: {
        type: 'plain_text',
        text: team.teamName,
      },
    },
    ...(containsDescription
      ? [
          {
            type: 'input',
            block_id: 'description_block',
            element: {
              type: 'plain_text_input',
              multiline: true,
              action_id: 'description_action',
              initial_value: sessionData.messageText ?? undefined,
            },
            label: {
              type: 'plain_text',
              text: 'Description',
            },
          },
        ]
      : []),
  ];
}

function getBlocks(
  modelViewType: ModelViewType,
  slackSettings: Settings,
  channelId: string,
  sessionData: SlashCommandSessionRecord,
  payload: EventBody,
) {
  const channel = slackSettings.Slack.channelMappings.find(
    (mapping) => mapping.channelId === channelId,
  );
  if (!channel) {
    // TODO(Manoj): return a message that Bot is not present in the channel
    return [];
  }
  if (modelViewType === ModelViewType.CREATE) {
    if (channel.teams?.length > 1) {
      sessionData.containsDescription = false;
      return channel.teams.flatMap((team: ChannelTeamMapping) =>
        createBlocks(team, false, sessionData),
      );
    }

    const team = channel.teams[0];
    sessionData.containsDescription = true;
    sessionData.teamId = team.teamId;

    return createBlocks(team, true, sessionData);
  } else if (modelViewType === ModelViewType.UPDATE) {
    const stateValue = payload.view.state.values;

    sessionData.containsDescription = true;

    return channel.teams.flatMap((team) => {
      const teamState = stateValue[team.teamId];
      if (teamState && teamState[`${team.teamId}_action`]?.selected_option) {
        sessionData.teamId = team.teamId;
        return createBlocks(team, true, sessionData);
      }
      return [];
    });
  }
  return [];
}

function getMessagesBlock(sessionData: SlashCommandSessionRecord) {
  if (!sessionData.messageText) {
    return [];
  }
  return [
    {
      type: 'header',
      block_id: 'message_header',
      text: {
        type: 'plain_text',
        text: 'Message',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: sessionData.messageText,
      },
    },
    ...(sessionData.messagedById
      ? [
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Sent by: <@${sessionData.messagedById}>`,
              },
            ],
          },
        ]
      : []),
  ];
}

export function getModalView(
  integrationAccount: IntegrationAccountWithRelations,
  channelId: string,
  modelViewType: ModelViewType,
  sessionData: SlashCommandSessionRecord,
  payload?: EventBody,
): Record<string, ModalType | SlashCommandSessionRecord> {
  const slackSettings = integrationAccount.settings as Settings;

  const blocks = getBlocks(
    modelViewType,
    slackSettings,
    channelId,
    sessionData,
    payload,
  );
  const messagesBlock = getMessagesBlock(sessionData);

  return {
    view: {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Create an Issue',
      },
      blocks: [...blocks, ...messagesBlock],
      submit: {
        type: 'plain_text',
        text: 'Submit',
      },
    },
    sessionData,
  };
}

export async function getState(
  prisma: PrismaService,
  action: string,
  teamId: string,
): Promise<string> {
  const category =
    action === 'opened' ? 'TRIAGE' : action === 'closed' ? 'COMPLETED' : null;

  if (category) {
    const workflow = await prisma.workflow.findFirst({
      where: { teamId, category },
      orderBy: { position: 'asc' },
    });
    return workflow?.id;
  }

  return undefined;
}

export async function getIssueData(
  prisma: PrismaService,
  sessionData: SlashCommandSessionRecord,
  eventBody: EventBody,
  integrationAccount: IntegrationAccount,
): Promise<slackIssueData> {
  const [stateId, userId] = await Promise.all([
    getState(prisma, 'opened', sessionData.teamId),
    getUserId(prisma, eventBody.user),
  ]);
  const issueInput: UpdateIssueInput = {
    description:
      eventBody.view.state.values.description_block.description_action.value,
    stateId,
    isBidirectional: true,
    subscriberIds: [...(userId ? [userId] : [])],
  } as UpdateIssueInput;

  const sourceMetadata = {
    id: integrationAccount.id,
    type: IntegrationName.Slack,
    channelId: sessionData.channelId,
  };

  return { issueInput, sourceMetadata, userId };
}

export async function getSlackUserIntegrationAccount(
  prisma: PrismaService,
  userId: string,
  workspaceId: string,
) {
  return prisma.integrationAccount.findFirst({
    where: {
      integratedById: userId,
      integrationDefinition: {
        workspaceId,
        name: IntegrationName.SlackPersonal,
      },
    },
  });
}

export async function getSlackIntegrationAccount(
  prisma: PrismaService,
  slackTeamId: string,
): Promise<IntegrationAccountWithRelations> {
  return prisma.integrationAccount.findFirst({
    where: {
      accountId: slackTeamId,
      integrationDefinition: {
        name: IntegrationName.Slack,
      },
    },
    include: { integrationDefinition: true, workspace: true },
  });
}

export async function getIssueMessageModal(
  prisma: PrismaService,
  issue: IssueWithRelations,
) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: issue.team.workspaceId },
  });
  const issueIdentifier = `${issue.team.identifier}-${issue.number}`;
  const issueUrl = `${process.env.PUBLIC_FRONTEND_HOST}/${workspace.slug}/issue/${issueIdentifier}`;
  const issueTitle = `${issueIdentifier} ${issue.title}`;
  return [
    {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<${issueUrl}|${issueTitle}>`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: issue.description,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: ':slack: This thread is synced with Slack',
              emoji: true,
            },
          ],
        },
      ],
    },
  ];
}

export async function upsertSlackMessage(
  prisma: PrismaService,
  logger: Logger,
  issueComment: IssueCommentWithRelations,
  integrationAccount: IntegrationAccountWithRelations,
  userId: string,
  action: IssueCommentAction,
) {
  logger.debug(`Upserting Slack issue comment for action: ${action}`);

  const [parentIssueComment, user] = await Promise.all([
    prisma.issueComment.findUnique({
      where: { id: issueComment.parentId },
    }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  const parentSourceData = parentIssueComment.sourceMetadata as Record<
    string,
    string
  >;

  const response = await postRequest(
    'https://slack.com/api/chat.postMessage',
    await getSlackHeaders(integrationAccount),
    {
      channel: parentSourceData.channelId,
      thread_ts: parentSourceData.parentTs || parentSourceData.idTs,
      text: issueComment.body,
      username: `${user.fullname} (via Tegon)`,
    },
  );

  if (response.data.ok) {
    const messageData = response.data;
    const message =
      messageData.subtype === 'message_changed'
        ? messageData.message
        : messageData;
    const threadId = `${messageData.channel}_${message.ts}`;
    const sourceData = {
      idTs: message.ts,
      parentTs: message.thread_ts,
      channelId: messageData.channel,
      channelType: messageData.channel_type,
      type: IntegrationName.Slack,
      userDisplayName: message.username ? message.username : message.user,
    };

    await prisma.linkedComment.create({
      data: {
        url: threadId,
        sourceId: threadId,
        source: { type: IntegrationName.Slack },
        commentId: issueComment.id,
        sourceData,
      },
    });
  }
}

export async function getSlackMessage(
  integrationAccount: IntegrationAccountWithRelations,
  sessionData: SlashCommandSessionRecord,
) {
  const response = await postRequest(
    'https://slack.com/api/conversations.history',
    await getSlackHeaders(integrationAccount),
    {
      channel: sessionData.channelId,
      latest: sessionData.threadTs,
      inclusive: true,
      limit: 1,
    },
  );

  return response.data;
}

export async function getSlackTeamInfo(
  integrationAccount: IntegrationAccountWithRelations,
  slackTeamId: string,
) {
  const response = await getRequest(
    `https://slack.com/api/team.info?team=${slackTeamId}`,
    await getSlackHeaders(integrationAccount),
  );

  return response.data;
}

export async function getExternalSlackUser(
  integrationAccount: IntegrationAccountWithRelations,
  slackUserId: string,
) {
  const response = await getRequest(
    `https://slack.com/api/users.info?user=${slackUserId}`,
    await getSlackHeaders(integrationAccount),
  );

  return response.data;
}

export async function sendSlackMessage(
  integrationAccount: IntegrationAccountWithRelations,
  payload: EventBody,
) {
  const response = await postRequest(
    'https://slack.com/api/chat.postMessage',
    getSlackHeaders(integrationAccount),
    payload,
  );

  return response.data;
}

export async function sendEphemeralMessage(
  integrationAccount: IntegrationAccountWithRelations,
  channelId: string,
  text: string,
  threadTs: string,
) {
  const slackSettings = integrationAccount.settings as Settings;

  const response = await postRequest(
    'https://slack.com/api/chat.postEphemeral',
    getSlackHeaders(integrationAccount),
    {
      channel: channelId,
      text,
      thread_ts: threadTs,
      user: slackSettings.Slack.botUserId,
      parse: 'full',
    },
  );

  return response.data;
}

export async function sendSlackLinkedMessage(
  prisma: PrismaService,
  logger: Logger,
  integrationAccount: IntegrationAccountWithRelations,
  linkedIssue: LinkedIssueWithRelations,
) {
  try {
    const { issue } = linkedIssue;
    const sourceData = linkedIssue.sourceData as LinkedIssueSourceData;
    const { team, number: issueNumber } = issue;
    const { identifier: teamIdentifier, workspaceId } = team;

    const issueIdentifier = `${teamIdentifier}-${issueNumber}`;
    logger.debug(`Sending Slack message for linked issue: ${issueIdentifier}`);

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    const issueUrl = `${process.env.PUBLIC_FRONTEND_HOST}/${workspace.slug}/issue/${issueIdentifier}`;
    const messagePayload: EventBody = {
      channel: sourceData.channelId,
      blocks: [
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `This thread is linked with a Tegon issue <${issueUrl}|${issueIdentifier}>`,
            },
          ],
        },
      ],
      thread_ts: sourceData.parentTs,
    };

    const messageData = await sendSlackMessage(
      integrationAccount,
      messagePayload,
    );
    logger.debug(
      `Slack message sent successfully for linked issue: ${issueIdentifier}`,
    );

    const linkedIssueData = await createIssueCommentAndLinkIssue(
      prisma,
      messageData,
      {
        channelId: sourceData.channelId,
        slackTeamDomain: sourceData.slackTeamDomain,
      },
      integrationAccount,
      linkedIssue.issue,
    );

    await prisma.linkedIssue.update({
      where: { id: linkedIssue.id },
      data: {
        source: linkedIssueData.source,
      },
    });
  } catch (error) {
    logger.error(
      `Error sending Slack message for linked issue: ${error.message}`,
    );
    throw error;
  }
}

export async function createIssueCommentAndLinkIssue(
  prisma: PrismaService,
  messageData: EventBody,
  sessionData: SlashCommandSessionRecord,
  integrationAccount: IntegrationAccountWithRelations,
  createdIssue: IssueWithRelations,
  userId?: string,
) {
  const { ts: messageTs, thread_ts: parentTs, channel_type } = messageData;
  const commentBody = `${IntegrationName.Slack} thread in #${getChannelNameFromIntegrationAccount(integrationAccount, sessionData.channelId)}`;

  const issueComment = await prisma.issueComment.create({
    data: {
      body: commentBody,
      issueId: createdIssue.id,
      sourceMetadata: {
        idTs: messageTs,
        parentTs,
        channelId: sessionData.channelId,
        channelType: channel_type,
        type: IntegrationName.Slack,
      },
    },
  });

  const mainTs = parentTs || messageTs;
  return {
    url: `https://${sessionData.slackTeamDomain}.slack.com/archives/${sessionData.channelId}/p${mainTs.replace('.', '')}`,
    sourceId: `${sessionData.channelId}_${mainTs}`,
    source: {
      type: IntegrationName.Slack,
      syncedCommentId: issueComment.id,
    },
    sourceData: {
      channelId: sessionData.channelId,
      messageTs,
      parentTs,
      slackTeamDomain: sessionData.slackTeamDomain,
    },
    createdById: userId,
  };
}

export function getChannelNameFromIntegrationAccount(
  integrationAccount: IntegrationAccountWithRelations,
  channelId: string,
) {
  const slackSettings = integrationAccount.settings as Settings;

  const channelMapping = slackSettings.Slack.channelMappings.find(
    (mapping) => mapping.channelId === channelId,
  );
  return channelMapping ? channelMapping.channelName : '';
}
