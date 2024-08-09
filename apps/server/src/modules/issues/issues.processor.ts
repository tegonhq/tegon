import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { VectorService } from 'modules/vector/vector.service';

import IssuesAIService from './issues-ai.service';
import { IssueWithRelations } from './issues.interface';

@Processor('issues')
export class IssuesProcessor {
  constructor(
    private vectorService: VectorService,
    private issuesAiservice: IssuesAIService,
  ) {}
  private readonly logger: Logger = new Logger('IssueProcessor');

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
