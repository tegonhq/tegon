/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { upsertGithubIssueComment } from 'modules/integrations/github/github.utils';

import {
  IssueCommentAction,
  IssueCommentWithRelations,
} from './issue-comments.interface';

export async function handleTwoWaySync(
  prisma: PrismaService,
  issueComment: IssueCommentWithRelations,
  action: IssueCommentAction,
  userId: string,
) {
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: {
      settings: {
        path: ['Github', 'repositoryMappings'],
        array_contains: [
          { teamId: issueComment.issue.teamId, bidirectional: true },
        ],
      } as Prisma.JsonFilter,
    },
    include: {
      integrationDefinition: true,
      workspace: true,
    },
  });

  if (integrationAccount) {
    // Two-way sync is enabled for this team
    // Perform the necessary sync operations here
    // ...

    await upsertGithubIssueComment(
      prisma,
      issueComment,
      integrationAccount,
      userId,
      action,
    );
  }
}
