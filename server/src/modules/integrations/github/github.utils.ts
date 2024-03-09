import { IntegrationAccount } from '@prisma/client';
import { Settings } from 'modules/integration_account/integration_account.interface';
import IssuesService from 'modules/issues/issues.service';
import { WebhookEventBody } from 'modules/webhooks/webhooks.interface';
import { PrismaService } from 'nestjs-prisma';

async function getState(
  prisma: PrismaService,
  action: string,
  teamId: string,
): Promise<string> {
  let workflow
  switch (action) {
    case 'opened' || 'reopened':
      workflow = await prisma.workflow.findFirst({where: {teamId, category: 'TRIAGE'}, orderBy: {position: 'asc'}});
      return workflow.id
    case 'closed':
      workflow = await prisma.workflow.findFirst({where: {teamId, category: 'COMPLETED'}, orderBy: {position: 'asc'}});
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

export async function handleIssues(
  prisma: PrismaService,
  _issuesService: IssuesService,
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
  const stateId = getState(prisma, eventBody.action, teamId);

  if(eventBody.action in ['opened', 'reopened']){
    // issuesService.createIssue()
  }

  console.log(teamId, stateId);
  return {};
}
