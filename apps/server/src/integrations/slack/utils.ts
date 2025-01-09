import { PrismaClient } from '@prisma/client';
import {
  EventBody,
  IntegrationAccount,
  Issue,
  JsonObject,
  TiptapMarks,
  TiptapNode,
  UpdateLinkedIssueDto,
  User,
  Workflow,
} from '@tegonhq/types';
import axios from 'axios';

import IssueCommentsService from 'modules/issue-comments/issue-comments.service';
import IssuesService from 'modules/issues/issues.service';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';
import { LoggerService } from 'modules/logger/logger.service';

import { SlackBlock, SlackElement } from './types';

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

export async function getWorkflows(prisma: PrismaClient, teamId: string) {
  return await prisma.workflow.findMany({ where: { teamId, deleted: null } });
}

export async function getTeamUsers(prisma: PrismaClient, teamId: string) {
  const usersOnWorkspaces = await prisma.usersOnWorkspaces.findMany({
    where: {
      teamIds: {
        has: teamId,
      },
      role: {
        not: 'BOT',
      },
    },
    select: {
      user: true,
    },
  });
  return usersOnWorkspaces.map((userOnWorkspace) => userOnWorkspace.user);
}

export function convertTemplateToBlocks(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template: Record<string, any>,
  workflows: Workflow[],
  assignees: User[],
) {
  const safeTemplateDescription = JSON.parse(template.description);

  const blocks = [];
  const content = safeTemplateDescription.content || [];

  blocks.push({
    type: 'input',
    element: {
      type: 'plain_text_input',
      action_id: 'title-action',
      initial_value: template.title || '',
    },
    label: {
      type: 'plain_text',
      text: 'Title',
      emoji: true,
    },
  });
  blocks.push({
    type: 'input',
    element: {
      type: 'static_select',
      placeholder: {
        type: 'plain_text',
        text: 'Select a state',
        emoji: true,
      },
      initial_option: {
        text: {
          type: 'plain_text',
          text:
            workflows.find((w) => w.id === template.stateId)?.name ||
            workflows[0].name,
          emoji: true,
        },
        value: template.stateId || workflows[0].id,
      },
      options: workflows.map((workflow) => ({
        text: {
          type: 'plain_text',
          text: workflow.name,
          emoji: true,
        },
        value: workflow.id,
      })),
      action_id: 'state-action',
    },
    label: {
      type: 'plain_text',
      text: 'State',
      emoji: true,
    },
  });
  blocks.push({
    type: 'input',
    element: {
      type: 'static_select',
      placeholder: {
        type: 'plain_text',
        text: 'Select an assignee',
        emoji: true,
      },
      initial_option: {
        text: {
          type: 'plain_text',
          text:
            assignees.find((a) => a.id === template.assigneeId)?.fullname ||
            assignees[0].fullname,
          emoji: true,
        },
        value: template.assigneeId || assignees[0].id,
      },
      options: assignees.map((assignee) => ({
        text: {
          type: 'plain_text',
          text: assignee.fullname || assignee.email,
          emoji: true,
        },
        value: assignee.id,
      })),
      action_id: 'assignee-action',
    },
    label: {
      type: 'plain_text',
      text: 'Assignee',
      emoji: true,
    },
  });

  for (let i = 0; i < content.length; i++) {
    const node = content[i];

    if (node.type === 'heading') {
      const headingText = node.content?.[0]?.text || '';
      const nextNode = content[i + 1];

      // If next node is a taskList, create checkboxes
      if (nextNode?.type === 'taskList') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = nextNode.content.map((item: any) => ({
          text: {
            type: 'plain_text',
            text: String(item.content?.[0]?.content?.[0]?.text || ''),
            emoji: true,
          },
          value: String(item.content?.[0]?.content?.[0]?.text || ''),
        }));

        blocks.push({
          type: 'input',
          optional: true,
          element: {
            type: 'checkboxes',
            options,
            action_id: 'checkboxes-action',
          },
          label: {
            type: 'plain_text',
            text: headingText,
            emoji: true,
          },
        });
        i++; // Skip the taskList node
      } else {
        // For all other headings, create multiline input
        blocks.push({
          type: 'input',
          optional: true,
          element: {
            type: 'plain_text_input',
            multiline: true,
            action_id: 'plain_text_input-action',
          },
          label: {
            type: 'plain_text',
            text: headingText,
            emoji: true,
          },
        });
      }
    }
  }

  return {
    title: {
      type: 'plain_text',
      text: 'Tegon',
      emoji: true,
    },
    submit: {
      type: 'plain_text',
      text: 'Submit',
      emoji: true,
    },
    type: 'modal',
    close: {
      type: 'plain_text',
      text: 'Cancel',
      emoji: true,
    },
    blocks,
  };
}

export function convertBlockToTemplate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewResponse: Record<string, any>,
) {
  const stateValues = viewResponse.view.state.values;
  const originalDescription = JSON.parse(template.description);
  const originalContent = originalDescription.content || [];
  const newContent = [];
  let title: string = '';

  // Extract title first
  const titleBlockId = Object.keys(stateValues).find((id) =>
    viewResponse.view.blocks.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (b: any) => b.block_id === id && b.label.text === 'Title',
    ),
  );

  if (titleBlockId) {
    title = stateValues[titleBlockId]['title-action']?.value;
  }

  // Extract status
  const statusBlockId = Object.keys(stateValues).find((id) =>
    viewResponse.view.blocks.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (b: any) => b.block_id === id && b.label.text === 'State',
    ),
  );

  let stateId = '';
  if (statusBlockId) {
    stateId =
      stateValues[statusBlockId]['state-action']?.selected_option?.value;
  }

  // Extract assignee
  const assigneeBlockId = Object.keys(stateValues).find((id) =>
    viewResponse.view.blocks.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (b: any) => b.block_id === id && b.label.text === 'Assignee',
    ),
  );

  let assigneeId = '';
  if (assigneeBlockId) {
    assigneeId =
      stateValues[assigneeBlockId]['assignee-action']?.selected_option?.value;
  }

  for (let i = 0; i < originalContent.length; i++) {
    const node = originalContent[i];

    if (node.type === 'heading') {
      // Copy heading with original formatting
      newContent.push(node);

      const blockId = Object.keys(stateValues).find((id) =>
        viewResponse.view.blocks.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (b: any) =>
            b.block_id === id && b.label.text === node.content?.[0]?.text,
        ),
      );

      if (blockId) {
        const blockValue = stateValues[blockId];

        if (blockValue['checkboxes-action']) {
          // Handle checkboxes maintaining taskList structure
          const selectedValues =
            blockValue['checkboxes-action'].selected_options?.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (opt: any) => opt.value,
            ) || [];

          const nextNode = originalContent[i + 1];
          if (nextNode?.type === 'taskList') {
            newContent.push({
              ...nextNode,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              content: nextNode.content.map((item: any) => ({
                ...item,
                attrs: {
                  ...item.attrs,
                  checked: selectedValues.includes(
                    item.content?.[0]?.content?.[0]?.text,
                  ),
                },
              })),
            });
            i++; // Skip original taskList
          }
        } else if (blockValue['plain_text_input-action']?.value) {
          // Handle text input
          newContent.push({
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: blockValue['plain_text_input-action'].value,
              },
            ],
          });
        }
      }
    } else if (node.type === 'paragraph') {
      newContent.push(node);
    }
  }

  const finalContent = { ...originalDescription, content: newContent };
  return {
    ...template,
    title,
    stateId,
    assigneeId,
    description: finalContent,
  };
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
              text: ':slack: This slack thread is synced with Tegon',
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

export async function issueCreate(
  prisma: PrismaClient,
  logger: LoggerService,
  issuesService: IssuesService,
  issueCommentsService: IssueCommentsService,
  linkedIssueService: LinkedIssueService,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateData: Record<string, any>,
  teamId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sessionData: Record<string, any>,
) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { workspace: true },
  });

  const slackUser = await prisma.integrationAccount.findFirst({
    where: { accountId: sessionData.slackUserId },
  });
  let userId = '';
  if (slackUser) {
    userId = slackUser.integratedById;
  } else {
    const user = await prisma.usersOnWorkspaces.findFirst({
      where: { workspaceId: team.workspaceId, user: { username: 'slack' } },
    });
    userId = user.userId;
  }

  const createdIssue = await issuesService.createIssueAPI(
    {
      ...templateData,
      title: templateData.title,
      stateId: templateData.stateId,
      description: JSON.stringify(templateData.description),
      teamId,
    },
    userId,
  );

  const messagePayload = {
    channel: sessionData.channelId,
    text: `<@${sessionData.slackUserId}> created a Issue`,
    attachments: await getIssueMessageModal(createdIssue, team.workspace.slug),
  };

  const integrationAccount = await prisma.integrationAccount.findUnique({
    where: { id: sessionData.integrationAccountId },
    include: { integrationDefinition: true },
  });

  const integrationConfig =
    integrationAccount.integrationConfiguration as JsonObject;

  const messageResponse = (
    await axios.post('https://slack.com/api/chat.postMessage', messagePayload, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${integrationConfig.api_key}`,
      },
    })
  ).data;

  if (messageResponse.ok) {
    logger.info({
      message: 'Slack message sent successfully',
      payload: messageResponse,
    });

    const message = messageResponse;

    const sourceMetadata = {
      id: integrationAccount.id,
      type: integrationAccount.integrationDefinition.slug,
      subType: 'Thread',
      channelId: sessionData.channelId,
      userDisplayName: sessionData.slackUsername,
    };

    const linkIssueData = {
      url: `https://${sessionData.slackTeamDomain}.slack.com/archives/${sessionData.channelId}/p${message.ts.replace('.', '')}`,
      sourceId: `${sessionData.channelId}_${message.ts}`,
      sourceData: {
        type: integrationAccount.integrationDefinition.slug,
        channelId: sessionData.channelId,
        parentTs: message.ts,
        title: `Slack message from: ${sessionData.slackChannelName}`,
        slackTeamDomain: sessionData.slackTeamDomain,
        userDisplayName: sessionData.slackUserName,
      },
      createdById: userId,
    };

    await issuesService.updateIssueApi(
      { teamId },
      { linkIssueData },
      { issueId: createdIssue.id },
      userId,
    );

    // Create a comment thread for this Slack thread and Update link issue with synced comment
    await createLinkIssueComment(
      logger,
      issueCommentsService,
      linkedIssueService,
      messageResponse,
      integrationAccount,
      linkIssueData,
      sessionData.slackChannelName,
      createdIssue.id,
      userId,
      sourceMetadata,
    );
  }

  return createdIssue;
}

export async function createLinkIssueComment(
  logger: LoggerService,
  issueCommentsService: IssueCommentsService,
  linkedIssueService: LinkedIssueService,
  messageResponse: EventBody,
  integrationAccount: IntegrationAccount,
  linkIssueInput: UpdateLinkedIssueDto,
  channelName: string,
  issueId: string,
  userId: string,
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

  const commentBody = `Slack thread in #${channelName}`;

  // Merge provided metadata with message-specific details
  const commentSourceMetadata = {
    ...sourceMetadata,
    type: integrationAccount.integrationDefinition.slug,
    parentTs,
    idTs: messageTs,
    channelType,
  };

  // Post the comment to the backend and capture the response
  const issueComment = await issueCommentsService.createIssueComment(
    {
      issueId,
    },
    userId,
    { body: commentBody, sourceMetadata: commentSourceMetadata },
  );

  // Log the successful creation of the issue comment
  logger.info({
    message: 'Issue comment created successfully',
    payload: issueComment,
  });

  // Update the linked issue input with the new comment ID and message timestamp
  linkIssueInput.sourceData.messageTs = messageTs;
  linkIssueInput.sourceData.syncedCommentId = issueComment.id;
  linkIssueInput.sourceData.type =
    integrationAccount.integrationDefinition.slug;

  // Update the linked issue source with the new data
  await linkedIssueService.updateLinkIssueBySource(
    linkIssueInput.sourceId,
    {
      sourceData: linkIssueInput.sourceData,
    },
    userId,
  );

  // Log the successful update of the linked issue
  logger.info({ message: 'Linked issue updated successfully' });
}
