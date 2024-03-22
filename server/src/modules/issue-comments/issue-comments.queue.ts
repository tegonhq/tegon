/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import {
  IssueCommentAction,
  IssueCommentWithRelations,
} from './issue-comments.interface';

@Injectable()
export class IssueCommentsQueue {
  constructor(
    @InjectQueue('issueComments') private readonly issueCommentsQueue: Queue,
  ) {}

  async addTwoWaySyncJob(
    issueComment: IssueCommentWithRelations,
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
