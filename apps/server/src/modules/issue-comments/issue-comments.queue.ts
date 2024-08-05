import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { IssueComment } from '@tegonhq/types';
import { Queue } from 'bull';

import { IssueCommentAction } from './issue-comments.interface';

@Injectable()
export class IssueCommentsQueue {
  constructor(
    @InjectQueue('issueComments') private readonly issueCommentsQueue: Queue,
  ) {}

  async addTwoWaySyncJob(
    issueComment: IssueComment,
    action: IssueCommentAction,
    userId: string,
  ) {
    await this.issueCommentsQueue.add('twoWaySyncComments', {
      issueComment,
      action,
      userId,
    });
  }
}
