import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Issue } from '@tegonhq/types';

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
  private readonly logger: Logger = new Logger('IssueQueue');

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

  async addIssueToVector(issue: Issue) {
    this.logger.log(`Adding issue to vector queue ${issue.id}`);
    await this.issuesQueue.add('addIssueToVector', { issue });
  }

  async handleTriageIssue(issue: Issue, isDeleted: boolean) {
    this.logger.log(`Handling Triage issue ${issue.id}`);
    await this.issuesQueue.add('handleTriageIssue', { issue, isDeleted });
  }
}
