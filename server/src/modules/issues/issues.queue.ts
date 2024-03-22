/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { Queue } from 'bull';

import {
  IssueAction,
  IssueRequestParams,
  LinkIssueInput,
  TeamRequestParams,
} from './issues.interface';

@Injectable()
export class IssuesQueue {
  constructor(@InjectQueue('issues') private readonly issuesQueue: Queue) {}

  async addTwoWaySyncJob(issue: Issue, action: IssueAction, userId: string) {
    await this.issuesQueue.add('twoWaySync', { issue, action, userId });
  }

  async addCreateLinkIssueJob(
    teamRequestParams: TeamRequestParams,
    linkIssue: LinkIssueInput,
    issueParams: IssueRequestParams,
    userId: string,
  ) {
    return await this.issuesQueue.add('createLinkIssue', {
      teamRequestParams,
      linkIssue,
      issueParams,
      userId,
    });
  }
}
