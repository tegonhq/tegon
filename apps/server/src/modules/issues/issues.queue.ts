import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Issue } from '@tegonhq/types';
import { Queue } from 'bull';
import { LoggerService } from 'modules/logger/logger.service';

@Injectable()
export class IssuesQueue {
  constructor(@InjectQueue('issues') private readonly issuesQueue: Queue) {}
  private readonly logger: LoggerService = new LoggerService('IssueQueue');

  async addIssueToVector(issue: Issue) {
    this.logger.info({
      message: `Adding issue to vector queue ${issue.id}`,
      where: `IssuesQueue.addIssueToVector`,
    });
    await this.issuesQueue.add('addIssueToVector', { issue });
  }

  async handleTriageIssue(issue: Issue, isDeleted: boolean) {
    this.logger.info({
      message: `Handling Triage issue ${issue.id}`,
      where: `IssuesQueue.handleTriageIssue`,
    });
    await this.issuesQueue.add('handleTriageIssue', { issue, isDeleted });
  }
}
