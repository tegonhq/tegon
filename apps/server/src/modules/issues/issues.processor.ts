import { LinkedIssue } from '@@generated/linkedIssue/entities';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { Job } from 'bull';
import { PrismaService } from 'nestjs-prisma';

import LinkedIssueService from 'modules/linked-issue/linked-issue.service';
import { VectorService } from 'modules/vector/vector.service';

import IssuesAIService from './issues-ai.service';
import {
  IssueAction,
  IssueRequestParams,
  IssueWithRelations,
  LinkIssueInput,
  TeamRequestParams,
} from './issues.interface';
import { handleTwoWaySync } from './issues.utils';

@Processor('issues')
export class IssuesProcessor {
  constructor(
    private prisma: PrismaService,
    private linkedIssueService: LinkedIssueService,
    private vectorService: VectorService,
    private issuesAiservice: IssuesAIService,
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

  @Process('addIssueToVector')
  async handleIssueToVector(job: Job<{ issue: IssueWithRelations }>) {
    const { issue } = job.data;
    this.logger.log(`Adding issue to Vector ${issue.id}`);
    await this.vectorService.createIssueEmbedding(issue);
  }

  @Process('handleTriageIssue')
  async handleTriageIssue(
    job: Job<{ issue: IssueWithRelations; isDeleted: boolean }>,
  ) {
    const { issue, isDeleted } = job.data;
    this.logger.log(`Handling triage for issue ${issue.id}`);

    if (isDeleted) {
      this.logger.log(
        `Issue ${issue.id} moved out of Triage, removing suggestions`,
      );
      return await this.issuesAiservice.deleteIssueSuggestion(issue.id);
    }

    await this.vectorService.createIssueEmbedding(issue);

    this.logger.log(`Finding similar issues for issue ${issue.id}`);
    await this.issuesAiservice.similarIssueSuggestion(
      issue.team.workspaceId,
      issue.id,
    );

    this.logger.log(`Generating issue suggestions for issue ${issue.id}`);
    return await this.issuesAiservice.issueSuggestions(issue);
  }
}
