import { PrismaClient } from '@prisma/client';
import {
  createIssue,
  search,
  setAccessToken,
  createLinkedIssue,
} from '@tegonhq/sdk';

const prisma = new PrismaClient();

export const webhookResponse = async (eventBody: any) => {
  if (eventBody.action === 'created') {
    return {
      grant_type: 'authorization_code',
      code: eventBody.data.installation.code,
    };
  }

  if (eventBody.action === 'get-teams') {
    return getAllTeams(eventBody.installationId);
  }

  if (eventBody.action === 'create-issue') {
    return createTegonIssue(eventBody);
  }

  if (eventBody.action === 'get-issues') {
    return getTegonIssues(eventBody);
  }

  if (eventBody.action === 'link-issue') {
    return createTegonLinkedIssue(eventBody);
  }

  return true;
};

async function getAllTeams(accountId: string): Promise<any> {
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: { accountId, deleted: null },
    include: { workspace: true, integrationDefinition: true },
  });

  if (!integrationAccount) {
    return null;
  }

  const workspaceId = integrationAccount.workspaceId;
  const teams = await prisma.team.findMany({
    where: { workspaceId },
    select: { id: true, name: true },
  });

  return teams.map(({ name, id }) => ({ label: name, value: id }));
}

async function createTegonIssue(eventBody: any): Promise<any> {
  const {
    installationId: accountId,
    fields,
    webUrl,
    project,
    issueId,
    actor,
  } = eventBody;
  const { teamId, title, description } = fields;

  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: { accountId, deleted: null },
    include: { workspace: true, integrationDefinition: true },
  });

  if (!integrationAccount) {
    return null;
  }

  const personalAccessToken = await prisma.personalAccessToken.findFirst({
    where: {
      workspaceId: integrationAccount.workspaceId,
      deleted: null,
      type: 'trigger',
      user: { username: 'sentry' },
    },
  });

  if (!personalAccessToken) {
    return null;
  }

  const workflow = await prisma.workflow.findFirst({
    where: { teamId, category: 'BACKLOG', deleted: null },
  });

  setAccessToken(personalAccessToken.jwt);

  const createdIssueResp = await createIssue({
    teamId,
    title,
    description,
    stateId: workflow.id,
    linkIssueData: {
      url: webUrl,
      sourceId: integrationAccount.integrationDefinitionId,
      sourceData: {
        title,
        issueId,
        project,
        actor,
      },
    },
  });

  const response = {
    webUrl: `http://localhost:3000/${integrationAccount.workspace.name}/issue/${createdIssueResp.number}`,
    project: createdIssueResp.team.name,
    identifier: `${createdIssueResp.team.identifier}-${createdIssueResp.number}`,
  };

  return response;
}

async function getTegonIssues(eventBody: any): Promise<any> {
  const { installationId: accountId, query } = eventBody;
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: { accountId, deleted: null },
    include: { workspace: true, integrationDefinition: true },
  });

  if (!integrationAccount) {
    return null;
  }

  const personalAccessToken = await prisma.personalAccessToken.findFirst({
    where: {
      workspaceId: integrationAccount.workspaceId,
      type: 'trigger',
      user: { username: 'sentry' },
      deleted: null,
    },
  });

  if (!personalAccessToken) {
    return null;
  }

  // Add search API here.
  setAccessToken(personalAccessToken.jwt);

  const searchIssueResp = (await search({
    workspaceId: personalAccessToken.workspaceId,
    query,
  })) as any[];

  return searchIssueResp.map(({ title, id, issueNumber }) => ({
    label: `${issueNumber}: ${title}`,
    value: id,
  }));
}

async function createTegonLinkedIssue(eventBody: any): Promise<any> {
  const {
    installationId: accountId,
    fields,
    webUrl,
    project,
    actor,
  } = eventBody;
  const { issueId, title } = fields;

  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: { accountId, deleted: null },
    include: { workspace: true, integrationDefinition: true },
  });

  if (!integrationAccount) {
    return null;
  }

  const personalAccessToken = await prisma.personalAccessToken.findFirst({
    where: {
      workspaceId: integrationAccount.workspaceId,
      type: 'trigger',
      user: { username: 'sentry' },
      deleted: null,
    },
  });

  if (!personalAccessToken) {
    return null;
  }

  // Add search API here.
  setAccessToken(personalAccessToken.jwt);
  const issue = await prisma.issue.findFirst({
    where: { id: issueId, deleted: null },
    include: { team: true },
  });

  const teamId = issue.teamId;

  await createLinkedIssue({
    issueId,
    teamId,
    url: webUrl,
    title,
    sourceId: integrationAccount.integrationDefinitionId,
    sourceData: {
      title,
      issueId,
      project,
      actor,
    },
  });
  return {
    webUrl: `http://localhost:3000/${integrationAccount.workspace.name}/issue/${issue.number}`,
    project: issue.team.name,
    identifier: `${issue.team.identifier}-${issue.number}`,
  };
}
