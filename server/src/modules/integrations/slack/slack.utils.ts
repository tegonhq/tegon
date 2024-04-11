/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IntegrationAccount, IntegrationName } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  ChannelTeamMapping,
  Config,
  IntegrationAccountWithRelations,
  Settings,
} from 'modules/integration-account/integration-account.interface';
import {
  IssueWithRelations,
  UpdateIssueInput,
} from 'modules/issues/issues.interface';
import { WebhookEventBody } from 'modules/webhooks/webhooks.interface';

import {
  ModalBlockType,
  ModalType,
  ModelViewType,
  SlashCommandSessionRecord,
} from './slack.interface';
import { EventBody } from '../integrations.interface';
import { getUserId, postRequest } from '../integrations.utils';

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

export function getModalView(
  integrationAccount: IntegrationAccountWithRelations,
  channelId: string,
  modelViewType: ModelViewType,
  payload?: WebhookEventBody,
): Record<string, ModalType | SlashCommandSessionRecord> {
  const slackSettings = integrationAccount.settings as Settings;
  const channel = slackSettings.Slack.channelMappings.find(
    (mapping) => mapping.channelId === channelId,
  );

  let blocks: ModalBlockType[] = [];
  let sessionData: SlashCommandSessionRecord = {};

  const createBlocks = (
    team: ChannelTeamMapping,
    containsDescription: boolean,
  ) => [
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
            },
            label: {
              type: 'plain_text',
              text: 'Description',
            },
          },
        ]
      : []),
  ];

  if (modelViewType === ModelViewType.CREATE) {
    if (channel.teams?.length > 1) {
      blocks = channel.teams.flatMap((team: ChannelTeamMapping) =>
        createBlocks(team, false),
      );
      sessionData = { containsDescription: false };
    } else {
      const team = channel.teams[0];
      blocks = createBlocks(team, true);
      sessionData = { containsDescription: true, teamId: team.teamId };
    }
  } else if (modelViewType === ModelViewType.UPDATE) {
    const stateValue = payload.view.state.values;

    blocks = channel.teams.flatMap((team) => {
      const teamState = stateValue[team.teamId];
      if (teamState && teamState[`${team.teamId}_action`]?.selected_option) {
        sessionData.teamId = team.teamId;
        return createBlocks(team, true);
      }
      return [];
    });
    sessionData.containsDescription = true;
  }

  return {
    view: {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Create an Issue',
      },
      blocks,
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
) {
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
      color: '#111827',
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
