import { PrismaClient } from '@prisma/client';
import { setAccessToken, createIssue, Issue } from '@tegonhq/sdk';

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
    webUrl,
    fields,
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
    where: { workspaceId: integrationAccount.workspaceId, deleted: null },
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
    title: `${title}-${new Date()}`,
    description,
    stateId: workflow.id,
    linkIssueData: {
      url: webUrl,
      sourceId: integrationAccount.integrationDefinitionId,
      sourceData: {
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

async function getTegonIssues(eventBody: any): Promise<Issue[]> {
  const { installationId: accountId } = eventBody;
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: { accountId, deleted: null },
    include: { workspace: true, integrationDefinition: true },
  });

  if (!integrationAccount) {
    return null;
  }

  const personalAccessToken = await prisma.personalAccessToken.findFirst({
    where: { workspaceId: integrationAccount.workspaceId, deleted: null },
  });

  if (!personalAccessToken) {
    return null;
  }

  // Add search API here.
  return [];
}
