/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IntegrationAccount, IntegrationName, Label } from '@prisma/client';
import axios from 'axios';
import { PrismaService } from 'nestjs-prisma';

import { Settings } from 'modules/integration_account/integration_account.interface';
import {
  CreateIssueInput,
  IssueRequestParams,
  // IssueRequestParams,
  LinkIssueData,
  TeamRequestParams,
  UpdateIssueInput,
} from 'modules/issues/issues.interface';
import IssuesService from 'modules/issues/issues.service';
import { WebhookEventBody } from 'modules/webhooks/webhooks.interface';

import { GithubSettings, labelDataType } from './github.interface';

async function getState(
  prisma: PrismaService,
  action: string,
  teamId: string,
): Promise<string> {
  let workflow;
  switch (action) {
    case 'opened':
    case 'reopened':
      workflow = await prisma.workflow.findFirst({
        where: { teamId, category: 'TRIAGE' },
        orderBy: { position: 'asc' },
      });
      return workflow.id;
    case 'closed':
      workflow = await prisma.workflow.findFirst({
        where: { teamId, category: 'COMPLETED' },
        orderBy: { position: 'asc' },
      });
      return workflow.id;
    default:
      return undefined;
  }
}

function getTeamId(repoId: string, accountSettings: Settings) {
  const mapping = accountSettings.repositoryMappings.find(
    (mapping: Record<string, string | number>) => {
      console.log(mapping.githubRepoId, repoId);
      return mapping.githubRepoId === repoId;
    },
  );
  return mapping ? mapping.teamId : undefined;
}

async function getIssueId(prisma: PrismaService, sourceIssueId: string) {
  const linkedIssue = await prisma.linkedIssues.findFirst({
    where: { sourceId: sourceIssueId.toString() },
    include: { issue: true },
  });
  return linkedIssue.issue.id;
}

async function getUserId(
  prisma: PrismaService,
  senderData: Record<string, string>,
  workspaceId: string,
) {
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: { accountId: senderData.id.toString() },
  });

  if (integrationAccount) {
    const usersOnWorkspace = await prisma.usersOnWorkspaces.findUnique({
      where: {
        userId_workspaceId: {
          userId: integrationAccount.integratedById,
          workspaceId: workspaceId,
        },
      },
    });
    const accountMappings = usersOnWorkspace.externalAccountMappings as Record<
      string,
      string
    >;
    return accountMappings[IntegrationName.Github] || null;
  }
  return null;
}

async function getIssueData(
  prisma: PrismaService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccount,
  teamId: string,
) {
  const stateId = await getState(prisma, eventBody.action, teamId);
  const userId = await getUserId(
    prisma,
    eventBody.sender,
    integrationAccount.workspaceId,
  );

  const linkIssueData = {
    title: `#${eventBody.issue.number} ${eventBody.issue.title}`,
    url: eventBody.issue.url,
    sourceId: eventBody.issue.id.toString(),
    source: { type: IntegrationName.Github },
    sourceData: { id: eventBody.issue.id, title: eventBody.issue.title },
  } as LinkIssueData;

  const issueInput = {
    title: eventBody.issue.title,
    description: eventBody.issue.body,
    stateId: stateId,
  } as CreateIssueInput;

  const sourceMetadata = {
    id: integrationAccount.id,
    type: IntegrationName.Github,
    userDisplayName: eventBody.sender.login,
  };

  return { linkIssueData, issueInput, sourceMetadata, userId };
}

async function getOrCreateLabel(
  prisma: PrismaService,
  labelData: labelDataType,
  teamId: string,
  workspaceId: string,
) {
  console.log(labelData);
  let label = await prisma.label.findFirst({
    where: { name: labelData.name, color: `#${labelData.color}` },
  });

  if (!label) {
    label = await prisma.label.create({
      data: {
        name: labelData.name,
        color: `#${labelData.color}`,
        teamId,
        workspaceId,
      },
    });
  }
  return label;
}

async function getIssueLabel(prisma: PrismaService, issueId: string) {
  const issue = await prisma.issue.findUnique({ where: { id: issueId } });

  return issue.labelIds;
}

export async function handleIssues(
  prisma: PrismaService,
  issuesService: IssuesService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccount,
) {
  const accountSettings = integrationAccount.settings as Settings;
  console.log(accountSettings);

  const teamId = getTeamId(eventBody.repository.id.toString(), accountSettings);
  console.log(teamId);
  let issueId, label: Label, issueLabelIds, userId;
  if (teamId) {
    switch (eventBody.action) {
      case 'opened':
        const createIssueData = await getIssueData(
          prisma,
          eventBody,
          integrationAccount,
          teamId,
        );
        await issuesService.createIssue(
          { teamId } as TeamRequestParams,
          createIssueData.issueInput,
          createIssueData.userId,
          createIssueData.linkIssueData,
          createIssueData.sourceMetadata,
        );
        break;

      case 'reopened':
      case 'closed':
        const updateIssueData = await getIssueData(
          prisma,
          eventBody,
          integrationAccount,
          teamId,
        );
        issueId = await getIssueId(prisma, eventBody.issue.id);
        await issuesService.updateIssue(
          { teamId } as TeamRequestParams,
          updateIssueData.issueInput as UpdateIssueInput,
          { issueId } as IssueRequestParams,
          updateIssueData.userId,
        );
        break;

      case 'labeled':
        label = await getOrCreateLabel(
          prisma,
          eventBody.label,
          teamId,
          integrationAccount.workspaceId,
        );
        issueId = await getIssueId(prisma, eventBody.issue.id);
        issueLabelIds = await getIssueLabel(prisma, issueId);
        issueLabelIds.push(label.id);
        userId = await getUserId(
          prisma,
          eventBody.sender,
          integrationAccount.workspaceId,
        );
        await issuesService.updateIssue(
          { teamId } as TeamRequestParams,
          { labelIds: issueLabelIds } as UpdateIssueInput,
          { issueId } as IssueRequestParams,
          userId,
        );

        break;

      case 'unlabeled':
        label = await getOrCreateLabel(
          prisma,
          eventBody.label,
          teamId,
          integrationAccount.workspaceId,
        );
        issueId = await getIssueId(prisma, eventBody.issue.id);
        issueLabelIds = await getIssueLabel(prisma, issueId);
        issueLabelIds = issueLabelIds.filter(id => id !== label.id);
        userId = await getUserId(
          prisma,
          eventBody.sender,
          integrationAccount.workspaceId,
        );
        await issuesService.updateIssue(
          { teamId } as TeamRequestParams,
          { labelIds: issueLabelIds } as UpdateIssueInput,
          { issueId } as IssueRequestParams,
          userId,
        );

        break;

      default:
        break;
    }

    if (['opened'].includes(eventBody.action)) {
    } else if (['reopened', 'closed'].includes(eventBody.action)) {
    }
  }

  return {};
}

async function getReponse(url: string, token: string) {
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  return response.data;
}

export async function getGithubSettings(installationId: string, token: string) {
  const orgUrl = `https://api.github.com/user/orgs`;
  const orgs = await getReponse(orgUrl, token);
  if (orgs.length !== 0) {
    const repoUrl = `https://api.github.com/user/installations/${installationId}/repositories`;
    const repos = await getReponse(repoUrl, token);
    return {
      orgAvatarURL: orgs[0].avatar_url,
      orgLogin: orgs[0].login,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      repositories: repos.repositories.map((repo: any) => {
        return { id: repo.id, fullName: repo.full_name };
      }),
    } as GithubSettings;
  }

  return {};
}
