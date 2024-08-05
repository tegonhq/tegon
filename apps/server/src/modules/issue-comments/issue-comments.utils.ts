import { Logger } from '@nestjs/common';
import { IntegrationNameEnum, IssueComment } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { Settings } from 'modules/integration-account/integration-account.interface';
import { upsertGithubIssueComment } from 'modules/integrations/github/github.utils';
import { upsertSlackMessage } from 'modules/integrations/slack/slack.utils';

import { IssueCommentAction } from './issue-comments.interface';

export async function handleTwoWaySync(
  prisma: PrismaService,
  logger: Logger,
  issueComment: IssueComment,
  action: IssueCommentAction,
  userId: string,
) {
  const parentSourceMetadata = issueComment.parent.sourceMetadata as Record<
    string,
    string
  >;
  if (parentSourceMetadata) {
    const integrationAccount = await prisma.integrationAccount.findUnique({
      where: {
        id: parentSourceMetadata.id,
        deleted: null,
      },
      include: {
        integrationDefinition: true,
        workspace: true,
      },
    });

    const integrationAccountSettings = integrationAccount.settings as Settings;

    const githubSettings =
      integrationAccountSettings[IntegrationNameEnum.Github];
    const slackSettings = integrationAccountSettings[IntegrationNameEnum.Slack];

    if (githubSettings) {
      // Two-way sync is enabled for this team
      await upsertGithubIssueComment(
        prisma,
        logger,
        issueComment,
        integrationAccount,
        userId,
        action,
      );
    } else if (slackSettings) {
      await upsertSlackMessage(
        prisma,
        logger,
        issueComment,
        integrationAccount,
        userId,
        action,
      );
    }
  }
}
