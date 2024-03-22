/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from 'nestjs-prisma';

import {
  IssueCommentAction,
  IssueCommentWithRelations,
} from './issue-comments.interface';
import { handleTwoWaySync } from './issue-comments.utils';

@Processor('issueComments')
export class IssueCommentsProcessor {
  constructor(private prisma: PrismaService) {}
  private readonly logger: Logger = new Logger('IssueCommentsProcessor');

  @Process('twoWaySyncComments')
  async handleTwoWaySync(
    job: Job<{
      issueComment: IssueCommentWithRelations;
      action: IssueCommentAction;
      userId: string;
    }>,
  ) {
    const { issueComment, action, userId } = job.data;
    this.logger.log(
      `Handling two-way sync for comment ${issueComment.id} with action ${action} by user ${userId}`,
    );
    await handleTwoWaySync(
      this.prisma,
      this.logger,
      issueComment,
      action,
      userId,
    );
  }
}
