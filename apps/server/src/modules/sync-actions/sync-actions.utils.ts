import { SyncActionTypeEnum, ModelName, SyncAction } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

export function convertToActionType(action: string): SyncActionTypeEnum {
  switch (action.toLowerCase()) {
    case 'insert':
      return SyncActionTypeEnum.I;
    case 'update':
      return SyncActionTypeEnum.U;
    case 'delete':
      return SyncActionTypeEnum.D;
  }

  return null;
}

export function convertLsnToInt(lsn: string) {
  const [logFileNumber, byteOffset] = lsn.split('/');
  const hexString = logFileNumber + byteOffset;
  return parseInt(hexString, 16);
}

export async function getWorkspaceId(
  prisma: PrismaService,
  modelName: ModelName,
  modelId: string,
): Promise<string> {
  switch (modelName) {
    case ModelName.Workspace:
      return modelId;

    case ModelName.Action:
      const action = await prisma.action.findUnique({
        where: { id: modelId },
      });
      return action.workspaceId;

    case ModelName.ActionEntity:
      const actionEntity = await prisma.actionEntity.findUnique({
        where: { id: modelId },
        include: { action: true },
      });
      return actionEntity.action.workspaceId;

    case ModelName.UsersOnWorkspaces:
      const usersOnWorkspace = await prisma.usersOnWorkspaces.findUnique({
        where: { id: modelId },
      });
      return usersOnWorkspace.workspaceId;

    case ModelName.Team:
      const team = await prisma.team.findUnique({
        where: { id: modelId },
      });
      return team.workspaceId;

    case ModelName.TeamPreference:
      const teamPreference = await prisma.teamPreference.findUnique({
        where: { id: modelId },
        include: { team: true },
      });
      return teamPreference.team.workspaceId;

    case ModelName.Issue:
      const issue = await prisma.issue.findUnique({
        where: { id: modelId },
        include: { team: true },
      });
      return issue.team.workspaceId;

    case ModelName.Label:
      const label = await prisma.label.findUnique({
        where: { id: modelId },
      });
      return label.workspaceId;

    case ModelName.Workflow:
      const workflow = await prisma.workflow.findUnique({
        where: { id: modelId },
        include: { team: true },
      });
      return workflow.team.workspaceId;

    case ModelName.Template:
      const template = await prisma.template.findUnique({
        where: { id: modelId },
      });
      return template.workspaceId;

    case ModelName.IssueComment:
      const issuecomment = await prisma.issueComment.findUnique({
        where: { id: modelId },
        include: { issue: { include: { team: true } } },
      });
      return issuecomment.issue.team.workspaceId;

    case ModelName.IssueHistory:
      const issueHistory = await prisma.issueHistory.findUnique({
        where: { id: modelId },
        include: { issue: { include: { team: true } } },
      });
      return issueHistory.issue.team.workspaceId;

    case ModelName.IntegrationAccount:
      const integrationAccount = await prisma.integrationAccount.findUnique({
        where: { id: modelId },
      });
      return integrationAccount.workspaceId;

    case ModelName.LinkedIssue:
      const linkedIssue = await prisma.linkedIssue.findUnique({
        where: { id: modelId },
        include: { issue: { include: { team: true } } },
      });
      return linkedIssue.issue.team.workspaceId;

    case ModelName.IssueRelation:
      const issueRelation = await prisma.issueRelation.findUnique({
        where: { id: modelId },
        include: { issue: { include: { team: true } } },
      });
      return issueRelation.issue.team.workspaceId;

    case ModelName.Notification:
      const notification = await prisma.notification.findUnique({
        where: { id: modelId },
      });
      return notification.workspaceId;

    case ModelName.View:
      const view = await prisma.view.findUnique({
        where: { id: modelId },
      });
      return view.workspaceId;

    case ModelName.IssueSuggestion:
      const issueSuggested = await prisma.issue.findUnique({
        where: { issueSuggestionId: modelId },
        include: { team: true },
      });
      return issueSuggested.team.workspaceId;

    case ModelName.Project:
      const project = await prisma.project.findUnique({
        where: { id: modelId },
      });
      return project.workspaceId;

    case ModelName.ProjectMilestone:
      const projectMilestone = await prisma.projectMilestone.findUnique({
        where: { id: modelId },
        include: { project: true },
      });
      return projectMilestone.project.workspaceId;

    default:
      return undefined;
  }
}

export async function getModelData(
  prisma: PrismaService,
  modelName: ModelName,
  modelId: string,
  userId?: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelMap: Record<ModelName, any> = {
    Workspace: prisma.workspace,
    Action: prisma.action,
    ActionEntity: prisma.actionEntity,
    UsersOnWorkspaces: prisma.usersOnWorkspaces,
    Team: prisma.team,
    TeamPreference: prisma.teamPreference,
    Issue: prisma.issue,
    Label: prisma.label,
    Workflow: prisma.workflow,
    Template: prisma.template,
    IssueComment: prisma.issueComment,
    IssueHistory: prisma.issueHistory,
    IntegrationAccount: {
      findUnique: (args: { where: { id: string } }) =>
        prisma.integrationAccount.findUnique({
          ...args,
          select: {
            id: true,
            accountId: true,
            settings: true,
            integratedById: true,
            createdAt: true,
            updatedAt: true,
            deleted: true,
            personal: true,
            workspaceId: true,
            integrationDefinitionId: true,
          },
        }),
    },
    LinkedIssue: prisma.linkedIssue,
    IssueRelation: {
      findUnique: (args: { where: { id: string } }) =>
        prisma.issueRelation.findUnique({
          ...args,
          select: {
            id: true,
            issueId: true,
            relatedIssueId: true,
            type: true,
            createdById: true,
            deletedById: true,
            createdAt: true,
            updatedAt: true,
            deleted: true,
          },
        }),
    },
    Notification: {
      findUnique: () => {
        if (userId) {
          return prisma.notification.findFirst({
            where: {
              id: modelId,
              userId,
            },
          });
        }
        return prisma.notification.findUnique({ where: { id: modelId } });
      },
    },
    View: prisma.view,
    IssueSuggestion: prisma.issueSuggestion,
    Project: prisma.project,
    ProjectMilestone: prisma.projectMilestone,
  };

  const model = modelMap[modelName];

  if (model) {
    return await model.findUnique({ where: { id: modelId } });
  }

  return undefined;
}

export async function getSyncActionsData(
  prisma: PrismaService,
  syncActionsData: SyncAction[],
  userId: string,
) {
  const modelDataResults = await Promise.all(
    syncActionsData.map((actionData) =>
      getModelData(prisma, actionData.modelName, actionData.modelId, userId),
    ),
  );

  return syncActionsData.reduce((result, actionData, index) => {
    const data = modelDataResults[index];
    if (data) {
      result.push({ data, ...actionData });
    }
    return result;
  }, []);
}

export async function getLastSequenceId(
  prisma: PrismaService,
  workspaceId: string,
): Promise<bigint> {
  const lastSyncAction = await prisma.syncAction.findFirst({
    where: {
      workspaceId,
    },
    orderBy: {
      sequenceId: 'desc',
    },
    distinct: ['modelName', 'workspaceId', 'modelId'],
  });

  return lastSyncAction.sequenceId;
}
