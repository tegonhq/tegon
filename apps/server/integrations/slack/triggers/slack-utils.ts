import { IntegrationName, PrismaClient } from '@prisma/client';

import { TiptapMarks, TiptapNode } from 'common/common.interface';

import { AttachmentResponse } from 'modules/attachments/attachments.interface';
import {
  Config,
  IntegrationAccountWithRelations,
} from 'modules/integration-account/integration-account.interface';
import { EventBody } from 'modules/integrations/integrations.interface';
import { SlashCommandSessionRecord } from 'modules/integrations/slack/slack.interface';
import {
  convertTiptapJsonToSlackBlocks,
  getChannelNameFromIntegrationAccount,
} from 'modules/integrations/slack/slack.utils';
import { IssueWithRelations } from 'modules/issues/issues.interface';
import { LinkedSlackMessageType } from 'modules/linked-issue/linked-issue.interface';

import { SlackBlock, SlackElement } from './slack.interface';
import { getRequest } from '../../integrations-utils';

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

export async function getSlackUserIntegrationAccount(
  prisma: PrismaClient,
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

/**
 * Retrieves the issue message modal for Slack.
 * @param prisma The Prisma service instance.
 * @param issue The issue with relations.
 * @returns An array containing the Slack message modal blocks.
 */
export async function getIssueMessageModal(
  prisma: PrismaClient,
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

export async function createIssueCommentAndLinkIssue(
  prisma: PrismaClient,
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

export async function getSlackIntegrationAccount(
  prisma: PrismaClient,
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
