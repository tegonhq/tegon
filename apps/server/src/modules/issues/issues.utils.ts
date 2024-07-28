import { Logger } from '@nestjs/common';
import { IntegrationName, Issue, LinkedIssue, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import AIRequestsService from 'modules/ai-requests/ai-requests.services';
import { IntegrationAccountWithRelations } from 'modules/integration-account/integration-account.interface';
import {
  sendGithubFirstComment,
  upsertGithubIssue,
} from 'modules/integrations/github/github.utils';
import { IssueHistoryData } from 'modules/issue-history/issue-history.interface';
import {
  LinkedIssueSource,
  LinkedIssueSubType,
} from 'modules/linked-issue/linked-issue.interface';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';

import {
  CreateIssueInput,
  IssueAction,
  IssueWithRelations,
  LinkIssueInput,
  SubscribeType,
  UpdateIssueInput,
} from './issues.interface';
import { LLMMappings } from 'modules/prompts/prompts.interface';

export async function getIssueDiff(
  newIssueData: Issue,
  currentIssueData: Issue,
): Promise<IssueHistoryData> {
  let issueHistoryData: IssueHistoryData = {} as IssueHistoryData;
  // Define the keys to compare between newIssueData and currentIssueData
  const keys = [
    'assigneeId',
    'priority',
    'parentId',
    'stateId',
    'estimate',
    'teamId',
  ];

  if (currentIssueData) {
    // If currentIssueData exists, compare the values for each key
    keys.forEach((key) => {
      const newIssueValue = getProperty(newIssueData, key as keyof Issue);
      const currentIssueValue = getProperty(
        currentIssueData,
        key as keyof Issue,
      );
      if (newIssueValue !== currentIssueValue) {
        // If the values are different, add the changes to issueHistoryData
        const fromKey = `from${capitalize(key)}` as keyof IssueHistoryData;
        const toKey = `to${capitalize(key)}` as keyof IssueHistoryData;
        issueHistoryData = {
          ...issueHistoryData,
          [fromKey]: currentIssueValue,
          [toKey]: newIssueValue,
        };
      }
    });

    // Compare the labelIds arrays and find added and removed labels
    const currentLabelsSet = new Set(currentIssueData.labelIds || []);
    const newLabelsSet = new Set(newIssueData.labelIds || []);
    const addedLabels =
      [...newLabelsSet].filter((x) => !currentLabelsSet.has(x)) || [];
    const removedLabels =
      [...currentLabelsSet].filter((x) => !newLabelsSet.has(x)) || [];

    // Add the added and removed labels to issueHistoryData
    issueHistoryData.addedLabelIds = addedLabels;
    issueHistoryData.removedLabelIds = removedLabels;
  } else {
    // If currentIssueData doesn't exist, add all values from newIssueData to issueHistoryData
    keys.forEach((key) => {
      const toKey = `to${capitalize(key)}` as keyof IssueHistoryData;
      issueHistoryData = {
        ...issueHistoryData,
        [toKey]: getProperty(newIssueData, key as keyof Issue),
      };
    });
    // Add all labelIds from newIssueData as addedLabelIds
    issueHistoryData.addedLabelIds = newIssueData.labelIds;
  }

  return issueHistoryData;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function getIssueTitle(
  prisma: PrismaService,
  aiRequestsService: AIRequestsService,
  issueData: CreateIssueInput | UpdateIssueInput,
  workspaceId: string,
): Promise<string> {
  if (issueData.title) {
    return issueData.title;
  } else if (issueData.description) {
    const titlePrompt = await prisma.prompt.findFirst({
      where: { name: 'IssueTitle', workspaceId },
    });
    return await aiRequestsService.getLLMRequest({
      messages: [
        { role: 'system', content: titlePrompt.prompt },
        { role: 'user', content: issueData.description },
      ],
      llmModel: LLMMappings[titlePrompt.model],
      model: 'IssueTitle',
      workspaceId,
    });
  }
  return '';
}

export async function getAiFilter(
  prisma: PrismaService,
  aiRequestsService: AIRequestsService,
  filterText: string,
  filterData: Record<string, string[]>,
  workspaceId: string,
) {
  const aiFilterPrompt = await prisma.prompt.findFirst({
    where: { name: 'Filter', workspaceId },
  });
  const filterPrompt = aiFilterPrompt.prompt
    .replace('{{status}}', filterData.workflowNames.join(', '))
    .replace('{{assignee}}', filterData.assigneeNames.join(', '))
    .replace('{{label}}', filterData.labelNames.join(', '));

  try {
    const response = await aiRequestsService.getLLMRequest({
      messages: [
        { role: 'system', content: filterPrompt },
        { role: 'user', content: filterText },
      ],
      llmModel: LLMMappings[aiFilterPrompt.model],
      model: 'AIFilters',
      workspaceId,
    });
    return JSON.parse(response);
  } catch (error) {
    return {};
  }
}

export async function getSuggestedLabels(
  prisma: PrismaService,
  aiRequestsService: AIRequestsService,
  labels: string[],
  description: string,
  workspaceId: string,
) {
  const labelPrompt = await prisma.prompt.findUnique({
    where: { name_workspaceId: { name: 'IssueLabels', workspaceId } },
  });
  return await aiRequestsService.getLLMRequest({
    messages: [
      { role: 'system', content: labelPrompt.prompt },
      {
        role: 'user',
        content: `Text Description  -  ${description} \n Company Specific Labels -  ${labels.join(',')}`,
      },
    ],
    llmModel: LLMMappings[labelPrompt.model],
    model: 'LabelSuggestion',
    workspaceId,
  });
}

export async function getLastIssueNumber(
  prisma: PrismaService,
  teamId: string,
): Promise<number> {
  const lastIssue = await prisma.issue.findFirst({
    where: { teamId },
    orderBy: { number: 'desc' },
  });
  return lastIssue?.number ?? 0;
}

export async function getLinkedIntegrationAccount(
  prisma: PrismaService,
  integrationName: IntegrationName,
  teamId: string,
) {
  switch (integrationName) {
    case IntegrationName.Github:
      return await prisma.integrationAccount.findFirst({
        where: {
          settings: {
            path: [IntegrationName.Github, 'repositoryMappings'],
            array_contains: [{ teamId }],
          } as Prisma.JsonFilter,
          isActive: true,
          deleted: null,
        },
        include: {
          integrationDefinition: true,
          workspace: true,
        },
      });

    case IntegrationName.Slack:
      return await prisma.integrationAccount.findFirst({
        where: {
          settings: {
            path: [IntegrationName.Slack, 'channelMappings'],
            array_contains: [{ teams: [{ teamId }] }],
          } as Prisma.JsonFilter,
        },
        include: {
          integrationDefinition: true,
          workspace: true,
        },
      });

    default:
      return undefined;
  }
}

export async function handleTwoWaySync(
  prisma: PrismaService,
  logger: Logger,
  linkedIssueService: LinkedIssueService,
  issue: IssueWithRelations,
  action: IssueAction,
  userId: string,
) {
  const linkedIssues = await prisma.linkedIssue.findMany({
    where: { issueId: issue.id, deleted: null },
  });

  if (linkedIssues.length > 0) {
    linkedIssues.map(async (linkedIssue: LinkedIssue) => {
      const linkedSource = linkedIssue.source as LinkedIssueSource;
      let integrationAccount: IntegrationAccountWithRelations;
      switch (linkedSource.type) {
        case IntegrationName.Github: {
          integrationAccount = await getLinkedIntegrationAccount(
            prisma,
            IntegrationName.Github,
            issue.teamId,
          );

          if (integrationAccount) {
            logger.debug(
              `Found integration account for linked issue ${linkedIssue.id} for team ${issue.teamId}`,
            );
            switch (action) {
              case IssueAction.CREATED: {
                logger.debug(
                  `Creating GitHub issue for Tegon issue ${issue.id}`,
                );
                await createGithubIssue(
                  prisma,
                  logger,
                  linkedIssueService,
                  issue,
                  userId,
                  linkedIssue.id,
                );
                break;
              }
              case IssueAction.UPDATED: {
                logger.debug(
                  `Updating GitHub issue for Tegon issue ${issue.id}`,
                );
                await upsertGithubIssue(
                  prisma,
                  logger,
                  issue,
                  integrationAccount,
                  userId,
                  linkedIssue.id,
                );
              }
            }
          } else {
            logger.log(
              `No integration account found for linked issue ${linkedIssue.id} for team ${issue.teamId}`,
            );
          }
          break;
        }

        case IntegrationName.Slack: {
          integrationAccount = await getLinkedIntegrationAccount(
            prisma,
            IntegrationName.Slack,
            issue.teamId,
          );
          break;
        }
      }
    });
  } else if (action === IssueAction.CREATED) {
    // TODO(Manoj): Handle it based on the destination
    logger.log(`No linked issue found for this issue ${issue.id}`);
    await createGithubIssue(prisma, logger, linkedIssueService, issue, userId);
  }
}

export async function createGithubIssue(
  prisma: PrismaService,
  logger: Logger,
  linkedIssueService: LinkedIssueService,
  issue: IssueWithRelations,
  userId: string,
  linkedIssueId?: string,
) {
  const integrationAccount = await getLinkedIntegrationAccount(
    prisma,
    IntegrationName.Github,
    issue.teamId,
  );
  logger.log(`Creating GitHub issue for Tegon issue ${issue.id}`);
  const githubIssue = await upsertGithubIssue(
    prisma,
    logger,
    issue,
    integrationAccount,
    userId,
    linkedIssueId,
  );

  if (githubIssue.id) {
    logger.debug(
      `Linking GitHub issue ${githubIssue.id} to Tegon issue ${issue.id}`,
    );
    await linkedIssueService.createLinkIssueAPI({
      url: githubIssue.html_url,
      sourceId: githubIssue.id.toString(),
      source: {
        type: IntegrationName.Github,
        subType: LinkedIssueSubType.GithubIssue,
      },
      sourceData: {
        id: githubIssue.id.toString(),
        title: githubIssue.title,
        apiUrl: githubIssue.url,
      },
      issueId: issue.id,
      createdById: userId,
    });

    logger.debug(`Sending first comment to GitHub issue ${githubIssue.id}`);
    await sendGithubFirstComment(
      prisma,
      logger,
      linkedIssueService,
      integrationAccount,
      issue,
      githubIssue.id.toString(),
    );
  }
}

export async function findExistingLink(
  prisma: PrismaService,
  linkData: LinkIssueInput,
) {
  const linkedIssue = await prisma.linkedIssue.findFirst({
    where: { url: linkData.url },
    include: { issue: { include: { team: true } } },
  });
  if (linkedIssue) {
    return {
      status: 400,
      message: `This ${linkData.type} has already been linked to an issue ${linkedIssue.issue.team.identifier}-${linkedIssue.issue.number}`,
    };
  }
  return { status: 200, message: null };
}

export function getSubscriberIds(
  userId: string,
  assigneeId: string,
  subscriberIds: string[] = [],
  type: SubscribeType,
): string[] {
  const subscribers = new Set(subscriberIds);

  switch (type) {
    case SubscribeType.UNSUBSCRIBE:
      subscribers.delete(userId);
      break;
    case SubscribeType.SUBSCRIBE:
      userId && subscribers.add(userId);
      assigneeId && subscribers.add(assigneeId);
      break;
    default:
      return undefined;
  }

  return Array.from(subscribers);
}

export async function getEquivalentStateIds(
  prisma: PrismaService,
  sourceTeamId: string,
  destinationTeamId: string,
) {
  const sourceStates = await prisma.workflow.findMany({
    where: { teamId: sourceTeamId, deleted: null },
  });
  const destinationStates = await prisma.workflow.findMany({
    where: { teamId: destinationTeamId, deleted: null },
  });

  const equivalentStateIds = sourceStates.reduce(
    (acc: Record<string, string>, sourceState) => {
      const destinationState = destinationStates.find(
        (state) =>
          state.name === sourceState.name &&
          state.category === sourceState.category,
      );

      if (destinationState) {
        acc[sourceState.id] = destinationState.id;
      }

      return acc;
    },
    {},
  );

  return equivalentStateIds;
}

export async function getSummary(
  prisma: PrismaService,
  aiRequestsService: AIRequestsService,
  conversations: string,
  workspaceId: string,
) {
  const summarizePrompt = await prisma.prompt.findFirst({
    where: { name: 'IssueSummary', workspaceId },
  });
  return await aiRequestsService.getLLMRequest({
    messages: [
      { role: 'system', content: summarizePrompt.prompt },
      {
        role: 'user',
        content: `[INPUT] conversations: ${conversations}`,
      },
    ],
    llmModel: LLMMappings[summarizePrompt.model],
    model: 'IssueSummary',
    workspaceId,
  });
}

export async function getWorkspace(prisma: PrismaService, teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { workspace: true },
  });
  return team.workspace;
}
