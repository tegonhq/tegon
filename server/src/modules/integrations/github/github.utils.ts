import { IntegrationAccount } from '@prisma/client';
import { Settings } from 'modules/integration_account/integration_account.interface';
import {
  CreateIssueInput,
  IssueRequestParams,
  LinkIssueData,
} from 'modules/issues/issues.interface';
import IssuesService from 'modules/issues/issues.service';
import { WebhookEventBody } from 'modules/webhooks/webhooks.interface';
import { PrismaService } from 'nestjs-prisma';

async function getState(
  prisma: PrismaService,
  action: string,
  teamId: string,
): Promise<string> {
  let workflow;
  switch (action) {
    case 'opened' || 'reopened':
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
  const mapping = accountSettings.github.repositoryMappings.find(
    (mapping: Record<string, string | number>) =>
      mapping.githubRepoId === repoId,
  );
  return mapping ? mapping.teamId : undefined;
}

async function getIssueId(prisma: PrismaService, sourceIssueId: string) {
  const issue = await prisma.linkedIssues.findFirst({
    where: { sourceId: sourceIssueId },
    include: { issue: true },
  });
  return issue.id;
}

export async function handleIssues(
  prisma: PrismaService,
  issuesService: IssuesService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccount,
) {
  const accountSettings = integrationAccount.settings as Settings;
  // const accountSettings = {
  //   github: {
  //     repositoryMappings: [
  //       { githubRepoId: 2342151, teamId: '2315123-235353-32453245' },
  //     ],
  //   },
  // };
  const teamId = getTeamId(eventBody.repository.id, accountSettings);
  const stateId = await getState(prisma, eventBody.action, teamId);

  if (eventBody.action in ['opened', 'reopened']) {
    await issuesService.createIssue(teamId, {
      description: eventBody.issue.body,
      stateId,
    } as CreateIssueInput, null, true, {} as LinkIssueData);
  } else if (eventBody.action === 'closed') {
    const issueId = await getIssueId(prisma, eventBody.issue.id);
    await issuesService.updateIssue(
      teamId,
      {
        description: eventBody.issue.body,
        stateId,
      } as CreateIssueInput,
      { issueId } as IssueRequestParams,
    );
  }

  console.log(teamId, stateId);
  return {};
}
