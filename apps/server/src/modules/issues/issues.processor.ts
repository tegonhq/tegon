import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { LoggerService } from 'modules/logger/logger.service';
import { VectorService } from 'modules/vector/vector.service';

import IssuesAIService from './issues-ai.service';
import { IssueWithRelations } from './issues.interface';

@Processor('issues')
export class IssuesProcessor {
  constructor(
    private vectorService: VectorService,
    private issuesAiservice: IssuesAIService,
  ) {}
  private readonly logger: LoggerService = new LoggerService('IssueProcessor');

  @Process('addIssueToVector')
  async handleIssueToVector(job: Job<{ issue: IssueWithRelations }>) {
    const { issue } = job.data;
    this.logger.info({
      message: `Adding issue to Vector ${issue.id}`,
      where: `IssuesProcessor.handleIssueToVector`,
    });
    await this.vectorService.createIssueEmbedding(issue);
  }

  @Process('handleTriageIssue')
  async handleTriageIssue(
    job: Job<{ issue: IssueWithRelations; isDeleted: boolean }>,
  ) {
    const { issue, isDeleted } = job.data;
    this.logger.info({
      message: `Handling triage for issue ${issue.id}`,
      where: `IssuesProcessor.handleIssueToVector`,
    });

    if (isDeleted) {
      this.logger.info({
        message: `Issue ${issue.id} moved out of Triage, removing suggestions`,
        where: `IssuesProcessor.handleIssueToVector`,
      });
      return await this.issuesAiservice.deleteIssueSuggestion(issue.id);
    }

    await this.vectorService.createIssueEmbedding(issue);

    this.logger.info({
      message: `Finding similar issues for issue ${issue.id}`,
      where: `IssuesProcessor.handleIssueToVector`,
    });
    await this.issuesAiservice.similarIssueSuggestion(
      issue.team.workspaceId,
      issue.id,
    );

    this.logger.info({
      message: `Generating issue suggestions for issue ${issue.id}`,
      where: `IssuesProcessor.handleIssueToVector`,
    });
    return await this.issuesAiservice.issueSuggestions(issue);
  }
}
