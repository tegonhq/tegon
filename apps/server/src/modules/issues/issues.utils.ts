import {
  ActionTypesEnum,
  CreateIssueDto,
  CreateLinkedIssueDto,
  FilterKey,
  FilterTypeEnum,
  FilterValue,
  GetIssuesByFilterDTO,
  Issue,
  IssueHistoryData,
  NotificationData,
  NotificationEventFrom,
  WorkflowCategory,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { convertMarkdownToTiptapJson } from 'common/utils/tiptap.utils';

import AIRequestsService from 'modules/ai-requests/ai-requests.services';
import { Env } from 'modules/triggerdev/triggerdev.interface';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

import { getIssueTitle } from './issues-ai.utils';
import { filterKeyReplacers, SubscribeType } from './issues.interface';
import { IssuesQueue } from './issues.queue';

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
    'projectId',
    'projectMilestoneId',
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

export async function findExistingLink(
  prisma: PrismaService,
  linkData: CreateLinkedIssueDto,
) {
  const linkedIssue = await prisma.linkedIssue.findFirst({
    where: { url: linkData.url },
    include: { issue: { include: { team: true } } },
  });
  if (linkedIssue) {
    return {
      status: 400,
      message: `This ${linkData.url} has already been linked to an issue ${linkedIssue.issue.team.identifier}-${linkedIssue.issue.number}`,
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
    orderBy: { position: 'asc' },
  });
  const destinationStates = await prisma.workflow.findMany({
    where: { teamId: destinationTeamId, deleted: null },
    orderBy: { position: 'asc' },
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
      } else {
        const statesInCategory = destinationStates.filter(
          (state) => state.category === sourceState.category,
        );
        const firstStateInCategory = statesInCategory.reduce(
          (minState, state) =>
            minState === null || state.position < minState.position
              ? state
              : minState,
          null,
        );
        if (firstStateInCategory) {
          acc[sourceState.id] = firstStateInCategory.id;
        }
      }

      return acc;
    },
    {},
  );

  return equivalentStateIds;
}

export async function getWorkspace(prisma: PrismaService, teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { workspace: true },
  });
  return team.workspace;
}

export async function handlePostCreateIssue(
  prisma: PrismaService,
  triggerdevService: TriggerdevService,
  issuesQueue: IssuesQueue,
  issue: Issue,
  linkMetaData: Record<string, string>,
) {
  // Add the issue to the notification queue if there are subscribers
  if (issue.subscriberIds) {
    await triggerdevService.triggerTaskAsync(
      'common',
      'notification',
      {
        event: ActionTypesEnum.ON_CREATE,
        notificationType: NotificationEventFrom.IssueCreated,
        notificationData: {
          issueId: issue.id,
          subscriberIds: issue.subscriberIds,
          toStateId: issue.stateId,
          toPriority: issue.priority,
          toAssigneeId: issue.assigneeId,
          sourceMetadata: linkMetaData,
          workspaceId: issue.team.workspaceId,
          userId: issue.createdById,
        } as NotificationData,
      },
      Env.PROD,
    );
  }

  // Add the issue to the vector service for similarity search
  issuesQueue.addIssueToVector(issue);

  // Check if the issue state is in the triage category and handle it accordingly
  const issueState = await prisma.workflow.findUnique({
    where: { id: issue.stateId },
  });
  if (issueState.category === WorkflowCategory.TRIAGE) {
    issuesQueue.handleTriageIssue(issue, false);
  }
}

export async function getCreateIssueInput(
  prisma: PrismaService,
  aiRequestsService: AIRequestsService,
  issueData: CreateIssueDto,
  workspaceId: string,
  userId: string,
) {
  const {
    parentId,
    teamId,
    description,
    descriptionMarkdown,
    ...otherIssueData
  } = issueData;

  delete otherIssueData.subIssues;
  delete otherIssueData.issueRelation;
  delete otherIssueData.linkIssueData;
  delete otherIssueData.sourceMetadata;

  let updatedDescription = description;
  if (!description && descriptionMarkdown) {
    updatedDescription = JSON.stringify(
      convertMarkdownToTiptapJson(descriptionMarkdown),
    );
    issueData.description = updatedDescription;
  }

  return {
    ...otherIssueData,
    description: updatedDescription,
    title: await getIssueTitle(
      prisma,
      aiRequestsService,
      issueData,
      workspaceId,
    ),
    team: { connect: { id: teamId } },
    updatedById: userId,
    createdById: userId,
    subscriberIds: getSubscriberIds(
      userId,
      issueData.assigneeId,
      null,
      SubscribeType.SUBSCRIBE,
    ),
    number: 0, // We're just initializing the number here, overwriting this while creating issue
    ...(parentId && { parent: { connect: { id: parentId } } }),
  };
}

export function getFilterWhere(getIssuesByFilter: GetIssuesByFilterDTO) {
  const { filters: filterData, workspaceId } = getIssuesByFilter;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = { team: { workspaceId } };

  for (const [filterKey, filterValue] of Object.entries(
    filterData as Record<FilterKey, FilterValue>,
  )) {
    const replacedFilterKey =
      filterKeyReplacers[filterKey as FilterKey] || filterKey;

    switch (filterValue.filterType) {
      case FilterTypeEnum.INCLUDES:
        where[replacedFilterKey] = {
          hasSome: filterValue.value,
        };
        break;
      case FilterTypeEnum.EXCLUDES:
        where['NOT'] = {
          ...where['NOT'],
          [replacedFilterKey]: {
            hasSome: filterValue.value,
          },
        };
        break;
      case FilterTypeEnum.IS:
        if (filterValue.value) {
          where[replacedFilterKey] = {
            in: filterValue.value,
          };
          break;
        }
        if (replacedFilterKey === 'parent') {
          where['subIssue'] = { some: {} };
        } else if (replacedFilterKey === 'subIssue') {
          where['parent'] = { isNot: null };
        } else {
          where['issueRelations'] = { some: { type: replacedFilterKey } };
        }

        break;
      case FilterTypeEnum.IS_NOT:
        where[replacedFilterKey] = {
          notIn: filterValue.value,
        };

        if (replacedFilterKey === 'parent') {
          where['subIssue'] = { some: {} };
        } else if (replacedFilterKey === 'subIssue') {
          where['NOT'] = {
            ...where['NOT'],
            subIssue: { some: {} },
          };
        } else {
          where['issueRelations'] = { some: { type: replacedFilterKey } };
        }
        break;

      case FilterTypeEnum.GT:
      case FilterTypeEnum.LT:
      case FilterTypeEnum.LTE:
      case FilterTypeEnum.GTE:
        where[replacedFilterKey] = {
          [filterValue.filterType.toLowerCase()]: filterValue.value,
        };
        break;

      default:
        break;
    }
  }

  return where;
}
