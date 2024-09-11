import {
  AttachmentResponse,
  createIssueComment,
  EventBody,
  IntegrationAccount,
  Issue,
  JsonObject,
  logger,
  TiptapMarks,
  TiptapNode,
  updateLinkedIssueBySource,
  UpdateLinkedIssueDto,
  uploadAttachment,
  Workflow,
} from '@tegonhq/sdk';

import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

import {
  SlackBlock,
  SlackElement,
  SlackSourceMetadata,
  SlashCommandSessionRecord,
} from './types';

export function getSlackHeaders(integrationAccount: IntegrationAccount) {
  const integrationConfig =
    integrationAccount.integrationConfiguration as JsonObject;
  return {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${integrationConfig.token}`,
    },
  };
}

export async function getSlackMessage(
  integrationAccount: IntegrationAccount,
  sessionData: SlashCommandSessionRecord,
) {
  const response = await axios.post(
    'https://slack.com/api/conversations.history',
    {
      channel: sessionData.channelId,
      latest: sessionData.parentTs,
      inclusive: true,
      limit: 1,
    },
    getSlackHeaders(integrationAccount),
  );

  return response.data;
}

export async function getSlackReplies(
  integrationAccount: IntegrationAccount,
  sessionData: SlashCommandSessionRecord,
) {
  const response = await axios.get(
    'https://slack.com/api/conversations.replies',
    {
      ...getSlackHeaders(integrationAccount),
      params: { channel: sessionData.channelId, ts: sessionData.parentTs },
    },
  );

  return response.data;
}

export async function sendSlackMessage(
  integrationAccount: IntegrationAccount,
  payload: EventBody,
) {
  const response = await axios.post(
    'https://slack.com/api/chat.postMessage',
    payload,
    getSlackHeaders(integrationAccount),
  );

  return response.data;
}

export async function sendEphemeralMessage(
  integrationAccount: IntegrationAccount,
  channelId: string,
  text: string,
  threadTs: string,
  userId: string,
) {
  const response = await axios.post(
    'https://slack.com/api/chat.postEphemeral',
    {
      channel: channelId,
      blocks: [{ type: 'section', text: { type: 'plain_text', text } }],
      thread_ts: threadTs,
      user: userId,
      parse: 'full',
    },
    getSlackHeaders(integrationAccount),
  );

  return response.data;
}

export async function getExternalSlackUser(
  integrationAccount: IntegrationAccount,
  slackUserId: string,
) {
  const response = await axios.get(
    `https://slack.com/api/users.info?user=${slackUserId}`,
    getSlackHeaders(integrationAccount),
  );

  return response.data;
}

export function getStateId(action: string, workflowStates: Workflow[]) {
  const category =
    action === 'opened' ? 'TRIAGE' : action === 'closed' ? 'COMPLETED' : null;
  if (category) {
    const workflow = workflowStates.find(
      (workflow) => workflow.category === category,
    );
    return workflow?.id;
  }

  return undefined;
}

export async function getChannelNameFromIntegrationAccount(
  integrationAccount: IntegrationAccount,
  channelId: string,
) {
  const response = await axios.get(
    `https://slack.com/api/conversations.info?channel=${channelId}`,
    getSlackHeaders(integrationAccount),
  );

  return response.data.channel.name;
}

export async function createLinkIssueComment(
  messageResponse: EventBody,
  integrationAccount: IntegrationAccount,
  linkIssueInput: UpdateLinkedIssueDto,
  channelId: string,
  issueId: string,
  // TODO: Update this type to be more specific than `any`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourceMetadata: any,
) {
  // Extract timestamp and thread information from the Slack message response
  const {
    ts: messageTs,
    thread_ts: parentTs,
    channel_type: channelType,
  } = messageResponse.message;

  // Create a comment body that includes the Slack channel's name
  const channelName = await getChannelNameFromIntegrationAccount(
    integrationAccount,
    channelId,
  );
  const commentBody = `Slack thread in #${channelName}`;

  // Merge provided metadata with message-specific details
  const commentSourceMetadata = {
    ...sourceMetadata,
    parentTs,
    idTs: messageTs,
    channelType,
  };

  // Post the comment to the backend and capture the response
  const issueComment = await createIssueComment({
    issueId,
    body: commentBody,
    sourceMetadata: commentSourceMetadata,
  });

  // Log the successful creation of the issue comment
  logger.info('Issue comment created successfully', { issueComment });

  // Update the linked issue input with the new comment ID and message timestamp
  linkIssueInput.sourceData.messageTs = messageTs;
  linkIssueInput.sourceData.syncedCommentId = issueComment.id;

  // Update the linked issue source with the new data
  await updateLinkedIssueBySource({
    sourceId: linkIssueInput.sourceId,
    sourceData: linkIssueInput.sourceData,
  });

  // Log the successful update of the linked issue
  logger.info('Linked issue updated successfully');
}

export async function addBotToChannel(
  integrationAccount: IntegrationAccount,
  channelId: string,
) {
  const botResponse = await axios.post(
    'https://slack.com/api/conversations.join',
    { channel: channelId },
    getSlackHeaders(integrationAccount),
  );

  return botResponse.data.ok;
}

export async function getSlackTeamInfo(slackTeamId: string, apiKey: string) {
  const response = await axios.get(
    `https://slack.com/api/team.info?team=${slackTeamId}`,
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  return response.data;
}

/**
 * Retrieves the files buffer from Slack.
 * @param integrationAccount The integration account with relations.
 * @param files The array of files from the Slack event body.
 * @returns Formdata with files.
 */
export async function getFilesBuffer(
  integrationAccount: IntegrationAccount,
  files: EventBody[],
) {
  const formData = new FormData();

  // Retrieve the files buffer for each file
  await Promise.all(
    files.map(async (file) => {
      const response = await axios.get(file.url_private, {
        ...getSlackHeaders(integrationAccount),
        responseType: 'stream',
      });

      const tempFilePath = `/tmp/${file.name}`;
      const writeStream = fs.createWriteStream(tempFilePath);

      await new Promise((resolve, reject) => {
        response.data.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      formData.append('files', fs.createReadStream(tempFilePath));

      return tempFilePath;
    }),
  );

  // Clean up the temporary files after the request is complete
  // tempFilePaths.forEach((filePath) => {
  //   fs.unlinkSync(filePath);
  // });

  return formData;
}

export async function getAttachmentUrls(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slackMessageResponse: any,
  integrationAccount: IntegrationAccount,
  sourceMetadata: SlackSourceMetadata,
) {
  let attachmentUrls: AttachmentResponse[] = [];
  // add Attachments
  if (slackMessageResponse.messages[0].files) {
    // Get the files buffer from Slack using the integration account and message files
    const filesFormData = await getFilesBuffer(
      integrationAccount,
      slackMessageResponse.messages[0].files,
    );
    filesFormData.append('sourceMetadata', JSON.stringify(sourceMetadata));

    // Upload the files to GCP and get the attachment URLs
    attachmentUrls = await uploadAttachment(
      integrationAccount.workspaceId,
      filesFormData,
    );
  }

  return attachmentUrls;
}

/// ******************* Tip tap utils *******************//////

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRichTextSection = (sectionElement: any): TiptapNode[] => {
  if (sectionElement.type === 'text') {
    // Split the text by newline characters
    const text = sectionElement.text;

    if (text === '') {
      return [];
    }
    // Create marks based on the text style
    const marks: TiptapMarks[] = Object.entries(sectionElement.style || {})
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value)
      .map(([type]) => ({ type }));
    return [{ type: 'text', text, marks }];
  } else if (sectionElement.type === 'link') {
    // Create a text node with a link mark for links
    return [
      {
        type: 'text',
        text: sectionElement.text ?? sectionElement.url,
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
};

export function convertSlackMessageToTiptapJson(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any,
  attachmentUrls: AttachmentResponse[],
): string {
  logger.debug(JSON.stringify(blocks));
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
                  content: element.elements.flatMap((sectionElement: any) =>
                    handleRichTextSection(sectionElement),
                  ),
                };
                return [paragraph];

              case 'rich_text_list':
                // Determine the list type based on the style
                const listType =
                  element.style === 'ordered' ? 'orderedList' : 'bulletList';
                // Create list items with paragraphs for each list element
                const listItems: TiptapNode[] = element.elements.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (item: any) => ({
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        content: item.elements.flatMap((listElement: any) =>
                          handleRichTextSection(listElement),
                        ),
                      },
                    ],
                  }),
                );

                listItems.push({ type: 'hardBreak' });
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
                const blockquoteContent = element.elements.flatMap(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (sectionElement: any) =>
                    handleRichTextSection(sectionElement),
                );

                return [
                  {
                    type: 'blockquote',
                    content: [
                      { type: 'paragraph', content: blockquoteContent },
                    ],
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

/**
 * Retrieves the issue message modal for Slack.
 * @param issue The issue with relations.
 * @param workspaceSlug The workspace slug
 * @returns An array containing the Slack message modal blocks.
 */
export async function getIssueMessageModal(
  issue: Issue,
  workspaceSlug: string,
) {
  // Generate the issue identifier using the team identifier and issue number
  const issueIdentifier = `${issue.team.identifier}-${issue.number}`;

  // Construct the issue URL using the workspace slug and issue identifier
  const issueUrl = `https://app.tegon.ai/${workspaceSlug}/issue/${issueIdentifier}`;

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
