/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Readable } from 'stream';

import { Logger } from '@nestjs/common';
import { IntegrationName } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { TiptapMarks, TiptapNode } from 'common/common.interface';

import { AttachmentResponse } from 'modules/attachments/attachments.interface';
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
  LinkedSlackMessageType,
} from 'modules/linked-issue/linked-issue.interface';

import {
  ModalType,
  ModelViewType,
  SlackBlock,
  SlackElement,
  SlashCommandSessionRecord,
  slackIssueData,
} from './slack.interface';
import { EventBody, RequestHeaders } from '../integrations.interface';
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
  // Return an array of blocks for the Slack message
  return [
    {
      // Define an input block for selecting an issue type
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
    // Conditionally include a description input block
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
  // Find the channel mapping based on the provided channelId
  const channel = slackSettings.Slack.channelMappings.find(
    (mapping) => mapping.channelId === channelId,
  );

  // If channel mapping is not found, return an empty array
  if (!channel) {
    // TODO(Manoj): return a message that Bot is not present in the channel
    return [];
  }

  // Handle the CREATE model view type
  if (modelViewType === ModelViewType.CREATE) {
    // If there are more than one team in the channel
    if (channel.teams?.length > 1) {
      sessionData.containsDescription = false;
      // Create blocks for each team without description
      return channel.teams.flatMap((team: ChannelTeamMapping) =>
        createBlocks(team, false, sessionData),
      );
    }

    // If there is only one team in the channel
    const team = channel.teams[0];
    sessionData.containsDescription = true;
    sessionData.teamId = team.teamId;

    // Create blocks for the single team with description
    return createBlocks(team, true, sessionData);
  }
  // Handle the UPDATE model view type
  else if (modelViewType === ModelViewType.UPDATE) {
    const stateValue = payload.view.state.values;

    sessionData.containsDescription = true;

    // Create blocks for each team based on the selected action
    return channel.teams.flatMap((team) => {
      const teamState = stateValue[team.teamId];
      if (teamState && teamState[`${team.teamId}_action`]?.selected_option) {
        sessionData.teamId = team.teamId;
        return createBlocks(team, true, sessionData);
      }
      return [];
    });
  }

  // Return an empty array if the model view type is not handled
  return [];
}

/**
 * Generates the message block for the Slack modal view.
 * @param sessionData The session data containing the message text and sender ID.
 * @returns An array of Slack block elements representing the message block.
 */
function getMessagesBlock(sessionData: SlashCommandSessionRecord) {
  // If there is no message text, return an empty array
  if (!sessionData.messageText) {
    return [];
  }

  // Create the message block
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
    // If there is a sender ID, include a context block with the sender information
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

/**
 * Generates the modal view for Slack integration.
 * @param integrationAccount The integration account with relations.
 * @param channelId The ID of the Slack channel.
 * @param modelViewType The type of the model view.
 * @param sessionData The session data from the slash command.
 * @param payload Optional event body payload.
 * @returns An object containing the modal view and session data.
 */
export function getModalView(
  integrationAccount: IntegrationAccountWithRelations,
  channelId: string,
  modelViewType: ModelViewType,
  sessionData: SlashCommandSessionRecord,
  payload?: EventBody,
): Record<string, ModalType | SlashCommandSessionRecord> {
  // Get the Slack settings from the integration account
  const slackSettings = integrationAccount.settings as Settings;

  // Get the blocks for the modal view
  const blocks = getBlocks(
    modelViewType,
    slackSettings,
    channelId,
    sessionData,
    payload,
  );

  // Get the messages block for the modal view
  const messagesBlock = getMessagesBlock(sessionData);

  // Return the modal view and session data
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
  integrationAccount: IntegrationAccountWithRelations,
): Promise<slackIssueData> {
  // Get the state ID and user ID concurrently
  const [stateId, userId] = await Promise.all([
    getState(prisma, 'opened', sessionData.teamId),
    getUserId(prisma, eventBody.user),
  ]);

  // Create the issue input object
  const issueInput: UpdateIssueInput = {
    description:
      eventBody.view.state.values.description_block.description_action.value,
    stateId,
    isBidirectional: true,
    subscriberIds: [...(userId ? [userId] : [])],
  } as UpdateIssueInput;

  const slackUserResponse = await getExternalSlackUser(
    integrationAccount,
    eventBody.user,
  );

  const slackUsername = slackUserResponse.user?.real_name || 'Slack';

  // Create the source metadata object
  const sourceMetadata = {
    id: integrationAccount.id,
    type: IntegrationName.Slack,
    subType: LinkedSlackMessageType.Thread,
    channelId: sessionData.channelId,
    userDisplayName: slackUsername,
  };

  // Return the issue data
  return { issueInput, sourceMetadata, userId };
}

export async function getSlackUserIntegrationAccount(
  prisma: PrismaService,
  userId: string,
  workspaceId: string,
) {
  let integrationAccount = null;
  if (userId) {
    integrationAccount = await prisma.integrationAccount.findFirst({
      where: {
        integratedById: userId,
        integrationDefinition: {
          workspaceId,
          name: IntegrationName.SlackPersonal,
        },
      },
    });
  }
  return integrationAccount;
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

/**
 * Retrieves the issue message modal for Slack.
 * @param prisma The Prisma service instance.
 * @param issue The issue with relations.
 * @returns An array containing the Slack message modal blocks.
 */
export async function getIssueMessageModal(
  prisma: PrismaService,
  issue: IssueWithRelations,
) {
  // Find the workspace based on the issue's team workspace ID
  const workspace = await prisma.workspace.findUnique({
    where: { id: issue.team.workspaceId },
  });

  // Generate the issue identifier using the team identifier and issue number
  const issueIdentifier = `${issue.team.identifier}-${issue.number}`;

  // Construct the issue URL using the workspace slug and issue identifier
  const issueUrl = `${process.env.PUBLIC_FRONTEND_HOST}/${workspace.slug}/issue/${issueIdentifier}`;

  // Generate the issue title by combining the issue identifier and title
  const issueTitle = `${issueIdentifier} ${issue.title}`;

  // Convert Tiptap JSON to slack blocks
  const descriptionBlocks = convertTiptapJsonToSlackBlocks(issue.description);

  // Return an array containing the Slack message modal blocks
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
        ...descriptionBlocks,
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

  // Fetch the parent issue comment and user in parallel
  const [parentIssueComment, user] = await Promise.all([
    prisma.issueComment.findUnique({
      where: { id: issueComment.parentId },
    }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  // Extract the source metadata from the parent issue comment
  const parentSourceData = parentIssueComment.sourceMetadata as Record<
    string,
    string
  >;

  // Send a POST request to the Slack API to post the message
  const response = await postRequest(
    'https://slack.com/api/chat.postMessage',
    getSlackHeaders(integrationAccount),
    {
      channel: parentSourceData.channelId,
      thread_ts: parentSourceData.parentTs || parentSourceData.idTs,
      // text: issueComment.body,
      blocks: convertTiptapJsonToSlackBlocks(issueComment.body),
      username: `${user.fullname} (via Tegon)`,
      // TODO(Manoj): Add User Icon
    },
  );

  // Check if the response from Slack API is successful
  if (response.data.ok) {
    const messageData = response.data;
    // Determine the message based on the subtype
    const message =
      messageData.subtype === 'message_changed'
        ? messageData.message
        : messageData;
    // Generate the thread ID using the channel and message timestamp
    const threadId = `${messageData.channel}_${message.ts}`;
    // Prepare the source data object
    const sourceData = {
      idTs: message.ts,
      parentTs: message.thread_ts,
      channelId: messageData.channel,
      channelType: messageData.channel_type,
      type: IntegrationName.Slack,
      userDisplayName: message.username ? message.username : message.user,
    };

    // Create a linked comment in the database
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
  userId: string,
) {
  const response = await postRequest(
    'https://slack.com/api/chat.postEphemeral',
    getSlackHeaders(integrationAccount),
    {
      channel: channelId,
      blocks: [{ type: 'section', text: { type: 'plain_text', text } }],
      thread_ts: threadTs,
      user: userId,
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
    // Extract issue and source data from the linked issue
    const { issue } = linkedIssue;
    const sourceData = linkedIssue.sourceData as LinkedIssueSourceData;
    const { team, number: issueNumber } = issue;
    const { identifier: teamIdentifier, workspaceId } = team;

    // Create the issue identifier
    const issueIdentifier = `${teamIdentifier}-${issueNumber}`;
    logger.debug(`Sending Slack message for linked issue: ${issueIdentifier}`);

    // Find the workspace using the workspaceId
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    // Create the issue URL using the workspace slug and issue identifier
    const issueUrl = `${process.env.PUBLIC_FRONTEND_HOST}/${workspace.slug}/issue/${issueIdentifier}`;

    // Create the message payload with the issue URL and thread details
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

    // Send the Slack message using the integration account and message payload
    const messageData = await sendSlackMessage(
      integrationAccount,
      messagePayload,
    );
    logger.debug(
      `Slack message sent successfully for linked issue: ${issueIdentifier}`,
    );

    // Create an issue comment and link the issue using the message data and integration account
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

    // Update the linked issue with the new source data
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
  // Extract relevant data from the Slack message event
  const { ts: messageTs, thread_ts: parentTs, channel_type } = messageData;

  // Generate the comment body with the Slack channel name
  const commentBody = `${IntegrationName.Slack} thread in #${getChannelNameFromIntegrationAccount(integrationAccount, sessionData.channelId)}`;

  // Create an issue comment in the database
  const issueComment = await prisma.issueComment.create({
    data: {
      body: commentBody,
      issueId: createdIssue.id,
      sourceMetadata: {
        id: integrationAccount.id,
        idTs: messageTs,
        parentTs,
        channelId: sessionData.channelId,
        channelType: channel_type,
        type: IntegrationName.Slack,
      },
    },
  });

  // Determine the main timestamp (parent or message timestamp)
  const mainTs = parentTs || messageTs;

  // Return the linked issue data
  return {
    url: `https://${sessionData.slackTeamDomain}.slack.com/archives/${sessionData.channelId}/p${mainTs.replace('.', '')}`,
    sourceId: `${sessionData.channelId}_${mainTs}`,
    source: {
      type: IntegrationName.Slack,
      subType: LinkedSlackMessageType.Thread,
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

/**
 * Retrieves the files buffer from Slack.
 * @param integrationAccount The integration account with relations.
 * @param files The array of files from the Slack event body.
 * @returns An array of Multer files.
 */
export async function getFilesBuffer(
  integrationAccount: IntegrationAccountWithRelations,
  files: EventBody[],
): Promise<Express.Multer.File[]> {
  // Set the headers for the Slack API request
  const headers = {
    ...getSlackHeaders(integrationAccount),
    responseType: 'arraybuffer',
  } as RequestHeaders;

  // Retrieve the files buffer for each file
  const multerFiles = await Promise.all(
    files.map(async (file) => {
      // Send a GET request to retrieve the file data
      const response = await getRequest(file.url_private, headers);

      // Convert the file data to a buffer
      const fileBuffer = Buffer.from(response.data, 'binary');

      // Create a Multer file object
      const multerFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: file.name,
        encoding: '7bit',
        mimetype: file.mimetype,
        size: file.size,
        buffer: fileBuffer,
        destination: '',
        filename: file.name,
        path: '',
        stream: new Readable(),
      };

      return multerFile;
    }),
  );

  return multerFiles;
}

export function convertSlackMessageToTiptapJson(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any,
  attachmentUrls: AttachmentResponse[],
): string {
  const content: TiptapNode[] = blocks
    ? blocks.flatMap((block: SlackBlock) => {
        if (block.type === 'rich_text') {
          return block.elements.flatMap((element: SlackElement) => {
            switch (element.type) {
              case 'rich_text_section':
                // Create a paragraph node for rich text sections
                const paragraph: TiptapNode = {
                  type: 'paragraph',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  content: element.elements.flatMap((sectionElement: any) => {
                    if (sectionElement.type === 'text') {
                      // Split the text by newline characters
                      const textParts = sectionElement.text.split('\n');
                      return textParts.flatMap(
                        (text: string, index: number) => {
                          if (text === '') {
                            return [];
                          }
                          // Create marks based on the text style
                          const marks: TiptapMarks[] = Object.entries(
                            sectionElement.style || {},
                          )
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            .filter(([_, value]) => value)
                            .map(([type]) => ({ type }));
                          return [
                            { type: 'text', text, marks },
                            // Add a hardBreak if it's not the last line
                            ...(index < textParts.length - 1
                              ? [{ type: 'hardBreak' }]
                              : []),
                          ];
                        },
                      );
                    } else if (sectionElement.type === 'link') {
                      // Create a text node with a link mark for links
                      return [
                        {
                          type: 'text',
                          text: sectionElement.url,
                          marks: [
                            {
                              type: 'link',
                              attrs: {
                                href: sectionElement.url,
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                class: 'c-link',
                              },
                            },
                          ],
                        },
                      ];
                    }
                    return [];
                  }),
                };
                return [paragraph];

              case 'rich_text_list':
                // Determine the list type based on the style
                const listType =
                  element.style === 'ordered' ? 'orderedList' : 'bulletList';
                // Create list items with paragraphs for each list element
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const listItems = element.elements.map((item: any) => ({
                  type: 'listItem',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  content: item.elements.flatMap((listElement: any) =>
                    listElement.text.split('\n').map((part: string) => ({
                      type: 'paragraph',
                      content: [{ type: 'text', text: part.trim() }],
                    })),
                  ),
                }));
                // Add the list to the content
                return [
                  {
                    type: listType,
                    attrs: { tight: true, start: 1 },
                    content: listItems,
                  },
                ];

              case 'rich_text_quote':
                // Create blockquote nodes for each line of the quote
                const blockquoteContent = element.elements[0].text
                  .split('\n')
                  .map((line: string) => ({
                    type: 'paragraph',
                    content: [{ type: 'text', text: line.trim() }],
                  }));

                return [
                  {
                    type: 'blockquote',
                    content: blockquoteContent,
                  },
                ];

              case 'rich_text_preformatted':
                // Create a codeBlock node for preformatted text
                return [
                  {
                    type: 'codeBlock',
                    attrs: { language: null },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content: element.elements.flatMap((sectionElement: any) => {
                      if (sectionElement.type === 'text') {
                        return [{ type: 'text', text: sectionElement.text }];
                      } else if (sectionElement.type === 'link') {
                        return [{ type: 'text', text: sectionElement.url }];
                      }
                      return [];
                    }),
                  },
                ];

              default:
                return undefined;
            }
          });
        } else if (block.type === 'header') {
          const headingText = block.text.text;
          return [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: headingText }],
            },
          ];
        } else if (block.type === 'section' && block.text.type === 'mrkdwn') {
          const taskListItems = block.text.text
            .toString()
            .split('\n')
            .map((item: string) => {
              const checked = item.startsWith(':white_check_mark:');
              const itemText = item.slice(item.indexOf(' ') + 1);
              return {
                type: 'taskItem',
                attrs: { checked },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: itemText }],
                  },
                ],
              };
            });
          return [
            {
              type: 'taskList',
              content: taskListItems,
            },
          ];
        }
        return [];
      })
    : [];

  // Add image nodes for attachments with image file types
  if (attachmentUrls && attachmentUrls.length > 0) {
    content.push(
      ...attachmentUrls.map((attachment) => ({
        type: attachment.fileType.startsWith('image/')
          ? 'image'
          : 'fileExtension',
        attrs: {
          src: attachment.publicURL,
          alt: attachment.originalName,
          size: attachment.size,
        },
      })),
    );
  }

  // Return the stringified Tiptap JSON
  return JSON.stringify({ type: 'doc', content });
}

function processTiptapNode(node: TiptapNode, blocks: SlackBlock[]) {
  switch (node.type) {
    case 'paragraph':
      // Create a rich text section for the paragraph node
      const richTextSection: SlackElement = {
        type: 'rich_text_section',
        elements:
          node.content
            ?.flatMap((child: TiptapNode) => {
              if (child.type === 'text') {
                // Create a text element for the text node
                const textElement: SlackElement = {
                  type: 'text',
                  text: child.text || '',
                  style: {},
                };
                // Apply marks to the text element based on the node's marks
                (child.marks || []).forEach((mark: TiptapMarks) => {
                  switch (mark.type) {
                    case 'bold':
                      textElement.style.bold = true;
                      break;
                    case 'italic':
                      textElement.style.italic = true;
                      break;
                    case 'code':
                      textElement.style.code = true;
                      break;
                    case 'strike':
                      textElement.style.strike = true;
                      break;
                    case 'link':
                      textElement.type = 'link';
                      textElement.url = mark.attrs.href;
                      break;
                  }
                });
                return textElement;
              } else if (child.type === 'hardBreak') {
                // Create a text element for the hard break
                return {
                  type: 'text',
                  text: '\n',
                };
              }
              return null;
            })
            .filter(Boolean) || [],
      };
      // Add the rich text section to the blocks array
      blocks.push({
        type: 'rich_text',
        elements: [richTextSection],
      });
      break;
    case 'hardBreak':
      // Handle hard breaks by appending a newline character to the last text element
      const lastBlockIndex = blocks.length - 1;
      const lastBlock = blocks[lastBlockIndex];
      if (lastBlock && lastBlock.type === 'rich_text') {
        const lastElementIndex = lastBlock.elements.length - 1;
        const lastElement = lastBlock.elements[lastElementIndex];
        if (lastElement && lastElement.type === 'rich_text_section') {
          const lastTextElementIndex = lastElement.elements.length - 1;
          const lastTextElement = lastElement.elements[lastTextElementIndex];
          if (lastTextElement && lastTextElement.type === 'text') {
            lastTextElement.text += '\n';
          } else {
            lastElement.elements.push({
              type: 'text',
              text: '\n',
            });
          }
          lastBlock.elements[lastElementIndex] = lastElement;
        } else {
          lastBlock.elements.push({
            type: 'rich_text_section',
            elements: [
              {
                type: 'text',
                text: '\n',
              },
            ],
          });
        }
        blocks[lastBlockIndex] = lastBlock;
      }
      break;
    case 'blockquote':
      // Create a rich text quote for the blockquote node
      const blockquoteElements =
        node.content?.flatMap((child: TiptapNode) =>
          child.content?.map((content) => ({
            type: 'text',
            text: `${content.text}\n`,
          })),
        ) || [];

      if (blockquoteElements.length > 0) {
        blocks.push({
          type: 'rich_text',
          elements: [
            {
              type: 'rich_text_quote',
              elements: blockquoteElements,
            },
          ],
        });
      }
      break;
    case 'orderedList':
    case 'bulletList':
      // Create a rich text list for the ordered or bullet list node
      const listElements =
        node.content?.map((listItem: TiptapNode) => ({
          type: 'rich_text_section',
          elements:
            listItem.content?.map((paragraph: TiptapNode) => ({
              type: 'text',
              text: paragraph.content?.[0]?.text || '',
            })) || [],
        })) || [];
      blocks.push({
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_list',
            style: node.type === 'orderedList' ? 'ordered' : 'bullet',
            elements: listElements,
          },
        ],
      });
      break;
    case 'codeBlock':
      // Create a rich text preformatted block for the code block node
      const codeBlockElements =
        node.content?.map((content) => ({
          type: 'text',
          text: content.text,
        })) || [];

      blocks.push({
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_preformatted',
            elements: codeBlockElements,
          },
        ],
      });
      break;
    case 'image':
      // Create an image block for the image node
      blocks.push({
        type: 'image',
        image_url: node.attrs?.src || '',
        alt_text: node.attrs?.alt || '',
      });
      break;
    case 'heading':
      const headingText = node.content
        ?.map((child: TiptapNode) =>
          child.type === 'text' ? child.text || '' : '',
        )
        .join('');
      blocks.push({
        type: 'header',
        text: {
          type: 'plain_text',
          text: headingText,
          emoji: true,
        },
      });
      break;
    case 'taskList':
      const taskListItems = node.content?.map((listItem: TiptapNode) => {
        const checked = listItem.attrs?.checked
          ? ':white_check_mark:'
          : ':black_medium_square:';
        const itemText = listItem.content
          ?.map((child: TiptapNode) =>
            child.content
              ?.map((grandChild: TiptapNode) => grandChild.text || '')
              .join(''),
          )
          .join('');
        return `${checked} ${itemText}`;
      });
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: taskListItems?.join('\n'),
        },
      });
      break;
  }
}

export function convertTiptapJsonToSlackBlocks(message: string): SlackBlock[] {
  try {
    // Parse the input message as JSON
    const parsedJson = JSON.parse(message);
    // Initialize an empty array to store the Slack blocks
    const blocks: SlackBlock[] = [];

    // Iterate over each node in the parsed JSON content
    parsedJson.content.forEach((node: TiptapNode) =>
      processTiptapNode(node, blocks),
    );

    // Return the generated Slack blocks
    return blocks;
  } catch (error) {
    // If the input is not a valid Tiptap JSON, return a section block with the raw text
    return [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message,
        },
      },
    ];
  }
}
