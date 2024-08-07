import { PrismaClient } from '@prisma/client';
import {
  IntegrationAccount,
  IntegrationInternalInput,
  InternalActionTypeEnum,
  LinkedIssue,
  ModelNameEnum,
  TwoWaySyncInput,
} from '@tegonhq/types';
import { configure, task, tasks } from '@trigger.dev/sdk/v3';

const prisma = new PrismaClient();
configure({
  secretKey: 'tr_dev_cyB8MTxcBbP9RpRhp8fO', // WARNING: Never actually hardcode your secret key like this
});
export const issueTrigger = task({
  id: `${ModelNameEnum.Issue}-trigger`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: async (payload: any) => {
    if (payload.isDeleted) {
      return { message: 'Issue is deleted' };
    }
    const issue = await prisma.issue.findUnique({
      where: { id: payload.modelId },
      include: { linkedIssue: true, team: true },
    });

    console.log(issue.isBidirectional, issue.linkedIssue.length);
    if (issue.isBidirectional) {
      if (issue.linkedIssue.length > 0) {
        // TODO(Manoj): Remove personal integration accounts
        const integrationAccounts = await prisma.integrationAccount.findMany({
          where: { workspaceId: issue.team.workspaceId, deleted: null },
          include: { integrationDefinition: true },
        });
        integrationAccounts.map((integrationAccount: IntegrationAccount) => {
          tasks.trigger(
            `${integrationAccount.integrationDefinition.name.toLowerCase()}-internal`,
            {
              modelName: ModelNameEnum.Issue,
              integrationAccount,
              actionType: InternalActionTypeEnum.TwoWaySync,
              modelPayload: { issue } as TwoWaySyncInput,
            } as IntegrationInternalInput,
          );
        });

        return { message: 'Creating a Issue in the source' };
      }

      issue.linkedIssue.map(async (linkedIssue: LinkedIssue) => {
        // TODO(Manoj): Fix type for linkedIssue source
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const linkedIssueSource = linkedIssue.source as Record<string, any>;
        console.log(linkedIssueSource);
        const integrationAccount = await prisma.integrationAccount.findUnique({
          where: { id: linkedIssueSource.integrationAccountId },
          include: { integrationDefinition: true, workspace: true },
        });
        console.log(integrationAccount);

        tasks.trigger(`${linkedIssueSource.type.toLowerCase()}-internal`, {
          modelName: ModelNameEnum.Issue,
          integrationAccount,
          actionType: InternalActionTypeEnum.TwoWaySync,
          modelPayload: { issue, linkedIssue } as TwoWaySyncInput,
        } as IntegrationInternalInput);
      });
    }

    return {
      message: 'Hello, world!',
    };
  },
});
