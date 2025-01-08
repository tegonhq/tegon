import { PrismaClient } from '@prisma/client';
import { EventBody, JsonObject } from '@tegonhq/types';
import axios from 'axios';

import { CacheService } from 'modules/cache/cache.service';
import IssueCommentsService from 'modules/issue-comments/issue-comments.service';
import IssuesService from 'modules/issues/issues.service';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';
import { LoggerService } from 'modules/logger/logger.service';

import {
  convertBlockToTemplate,
  convertTemplateToBlocks,
  getTeamUsers,
  getWorkflows,
  issueCreate,
} from './utils';

const prisma = new PrismaClient();
const cacheService = new CacheService();

export const slashCommand = async (
  logger: LoggerService,
  eventBody: EventBody,
) => {
  const { trigger_id: triggerId, token } = eventBody;
  const channelId = eventBody?.channel_id || eventBody.channel?.id;
  const slackChannelName = eventBody?.channel_name;
  const slackTeamId = eventBody?.team_id || eventBody.team?.id;
  const teamDomain = eventBody?.team_domain || eventBody.team?.domain;
  const slackUserId = eventBody?.user_id;
  const slackUserName = eventBody?.user_name;
  const message = eventBody.message;

  // Find the integration account associated with the Slack team ID
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: { accountId: slackTeamId },
    include: { workspace: true, integrationDefinition: true },
  });

  const integrationConfig =
    integrationAccount.integrationConfiguration as JsonObject;

  // If no integration account is found, log a message and return
  if (!integrationAccount) {
    logger.log({
      message: `No integration account found for team ${slackTeamId}`,
    });
    return;
  }

  // Create session data object with relevant information
  const sessionData = {
    slackTeamId,
    channelId,
    integrationAccountId: integrationAccount.id,
    slackTeamDomain: teamDomain,
    slackUserId,
    slackChannelName,
    slackUserName,
    threadTs: message?.ts || null,
    messageText: message?.text || null,
    messagedById: message?.user || null,
  };

  const templates = await prisma.template.findMany({
    where: { workspaceId: integrationAccount.workspaceId, deleted: null },
  });

  const templateOptions = templates.map((template) => ({
    text: {
      type: 'plain_text',
      text: template.name,
      emoji: true,
    },
    value: template.id,
  }));

  const view = {
    type: 'modal',
    title: {
      type: 'plain_text',
      text: 'Create a Tegon issue',
      emoji: true,
    },
    submit: {
      type: 'plain_text',
      text: 'Submit',
      emoji: true,
    },
    close: {
      type: 'plain_text',
      text: 'Cancel',
      emoji: true,
    },
    blocks: [
      {
        type: 'input',
        element: {
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Pick a template',
            emoji: true,
          },
          options: templateOptions,
          action_id: 'template-action',
        },
        label: {
          type: 'plain_text',
          text: 'Template',
          emoji: true,
        },
      },
    ],
  };

  await cacheService.set(token, JSON.stringify(sessionData));

  await axios.post(
    'https://slack.com/api/views.open',
    {
      trigger_id: triggerId,
      view,
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${integrationConfig.api_key}`,
      },
    },
  );
};

export const interaction = async (
  logger: LoggerService,
  eventBody: EventBody,
  issuesService: IssuesService,
  issueCommentsService: IssueCommentsService,
  linkedIssueService: LinkedIssueService,
) => {
  const payload = JSON.parse(eventBody.payload);
  if (payload.type === 'view_submission') {
    // Get the template action value directly from the state values
    const templateActionBlock = Object.values(payload.view.state.values).find(
      (block) =>
        block && typeof block === 'object' && 'template-action' in block,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as Record<string, any>;
    const sessionData = JSON.parse(await cacheService.get(payload.token));
    if (!sessionData) {
      return { response_action: 'clear' };
    }

    logger.log({ message: 'No, template block found in the payload' });
    if (!templateActionBlock) {
      const template = await prisma.template.findUnique({
        where: { id: sessionData.templateId },
      });

      if (!template) {
        return { response_action: 'clear' };
      }

      const templateData = convertBlockToTemplate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        template.templateData as Record<string, any>,
        payload,
      );

      await issueCreate(
        prisma,
        logger,
        issuesService,
        issueCommentsService,
        linkedIssueService,
        templateData.title,
        templateData.assigneeId,
        templateData.stateId,
        JSON.stringify(templateData.description),
        template.teamId,
        sessionData,
      );

      return { response_action: 'clear' };
    }

    const selectedTemplateId =
      templateActionBlock?.['template-action']?.selected_option?.value;

    sessionData.templateId = selectedTemplateId;

    const template = await prisma.template.findUnique({
      where: { id: selectedTemplateId },
    });

    const [workflows, assignees] = await Promise.all([
      getWorkflows(prisma, template.teamId),
      getTeamUsers(prisma, template.teamId),
    ]);

    logger.log({ message: 'conveting Template to blocks' });
    const view = convertTemplateToBlocks(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      template.templateData as Record<string, any>,
      workflows,
      assignees,
    );

    await cacheService.set(payload.token, JSON.stringify(sessionData), 86400);

    return { response_action: 'update', view };
  }
  return { response_action: 'clear' };
};
