import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { handleTwoWaySync } from './issues.utils';
import { PrismaService } from 'nestjs-prisma';
import { Issue } from '@prisma/client';
import {
  IssueAction,
  IssueRequestParams,
  LinkIssueInput,
  TeamRequestParams,
} from './issues.interface';
import { Logger } from '@nestjs/common';
import { LinkedIssue } from '@@generated/linkedIssue/entities';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';

@Processor('issues')
export class IssuesProcessor {
  constructor(
    private prisma: PrismaService,
    private linkedIssueService: LinkedIssueService,
  ) {}
  private readonly logger: Logger = new Logger('IssueProcessor');

  @Process('twoWaySync')
  async handleTwoWaySync(
    job: Job<{ issue: Issue; action: IssueAction; userId: string }>,
  ) {
    const { issue, action, userId } = job.data;
    this.logger.log(
      `Handling two-way sync for issue ${issue.id} with action ${action} by user ${userId}`,
    );
    await handleTwoWaySync(
      this.prisma,
      this.logger,
      this.linkedIssueService,
      issue,
      action,
      userId,
    );
  }

  @Process('createLinkIssue')
  async handleCreateLinkIssue(
    job: Job<{
      teamRequestParams: TeamRequestParams;
      linkIssue: LinkIssueInput;
      issueParams: IssueRequestParams;
      userId: string;
    }>,
  ) {
    const { teamRequestParams, linkIssue, issueParams, userId } = job.data;
    this.logger.log(`Creating link issue for the url: ${linkIssue.url}`);
    const response = await this.linkedIssueService.createLinkIssue(
      teamRequestParams,
      linkIssue,
      issueParams,
      userId,
    );

    if (response instanceof LinkedIssue) {
      // Response is a linkIssue
      this.logger.log(`Issue linked with this URL: ${linkIssue.url}`);
    } else {
      // Response is an APIResponse
      this.logger.error(`Linking issue is failed: ${JSON.stringify(response)}`);
    }

    return response;
  }
}
