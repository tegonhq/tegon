/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Logger } from '@nestjs/common';
import { IntegrationName } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { Settings } from 'modules/integration-account/integration-account.interface';
import { upsertGithubIssueComment } from 'modules/integrations/github/github.utils';
import { upsertSlackMessage } from 'modules/integrations/slack/slack.utils';

import {
  IssueCommentAction,
  IssueCommentWithRelations,
} from './issue-comments.interface';

export async function handleTwoWaySync(
  prisma: PrismaService,
  logger: Logger,
  issueComment: IssueCommentWithRelations,
  action: IssueCommentAction,
  userId: string,
) {
  const issueSourceMetadata = issueComment.issue.sourceMetadata as Record<
    string,
    string
  >;
  if (issueSourceMetadata) {
    const integrationAccount = await prisma.integrationAccount.findUnique({
      where: {
        id: issueSourceMetadata.id,
        deleted: null,
      },
      include: {
        integrationDefinition: true,
        workspace: true,
      },
    });

    const integrationAccountSettings = integrationAccount.settings as Settings;

    const githubSettings = integrationAccountSettings[IntegrationName.Github];
    const slackSettings = integrationAccountSettings[IntegrationName.Slack];

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
