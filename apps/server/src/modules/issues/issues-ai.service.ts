import { Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'nestjs-prisma';

import { convertTiptapJsonToText } from 'common/utils/tiptap.utils';

import AIRequestsService from 'modules/ai-requests/ai-requests.services';
import {
  IssueRelationInput,
  IssueRelationType,
} from 'modules/issue-relation/issue-relation.interface';
import IssueRelationService from 'modules/issue-relation/issue-relation.service';
import { LLMMappings } from 'modules/prompts/prompts.interface';
import { VectorService } from 'modules/vector/vector.service';

import {
  AIInput,
  CreateIssueInput,
  DescriptionInput,
  FilterInput,
  IssueWithRelations,
  SubIssueInput,
  TeamRequestParams,
} from './issues.interface';
import {
  getAiFilter,
  getIssueTitle,
  getSuggestedLabels,
  getSummary,
  getWorkspace,
} from './issues.utils';

@Injectable()
export default class IssuesAIService {
  private readonly logger: Logger = new Logger('IssueAIService');

  constructor(
    private prisma: PrismaService,
    private vectorService: VectorService,
    private aiRequestsService: AIRequestsService,
    private issueRelationService: IssueRelationService,
  ) {}

  /**
   * Generates suggestions for labels and assignees based on the issue description.
   * @param teamRequestParams The team request parameters.
   * @param suggestionsInput The input for generating suggestions, including the issue description and workspace ID.
   * @returns An object containing the suggested labels and assignees.
   */
  async suggestions(
    teamRequestParams: TeamRequestParams,
    suggestionsInput: AIInput,
  ) {
    // Check if the description is empty or falsy
    if (!suggestionsInput.description) {
      return { labels: [], assignees: [] };
    }

    // Find labels based on the workspace ID and team ID
    const labels = await this.prisma.label.findMany({
      where: {
        OR: [
          { workspaceId: suggestionsInput.workspaceId },
          { teamId: teamRequestParams.teamId },
        ],
      },
    });

    // Get suggested labels and similar issues concurrently
    const [labelsSuggested, similarIssues] = await Promise.all([
      getSuggestedLabels(
        this.prisma,
        this.aiRequestsService,
        labels.map((label) => label.name),
        suggestionsInput.description,
        suggestionsInput.workspaceId,
      ),
      this.vectorService.searchEmbeddings(
        suggestionsInput.workspaceId,
        suggestionsInput.description,
        10,
        0.2,
      ),
    ]);

    // Find suggested labels based on the suggested label names
    const suggestedLabels = await this.prisma.label.findMany({
      where: {
        name: { in: labelsSuggested.split(/,\s*/), mode: 'insensitive' },
        OR: [
          { workspaceId: suggestionsInput.workspaceId },
          { teamId: teamRequestParams.teamId },
        ],
      },
      select: { id: true, name: true, color: true },
    });

    // Extract unique assignee IDs from similar issues
    const assigneeIds = new Set(
      similarIssues
        .filter((issue) => issue.assigneeId)
        .map((issue) => issue.assigneeId),
    );

    // Map assignee IDs to assignee objects with scores
    const assignees = Array.from(assigneeIds).map((assigneeId) => ({
      id: assigneeId,
      score: similarIssues.find((issue) => issue.assigneeId === assigneeId)
        .score,
    }));

    return { labels: suggestedLabels, assignees };
  }

  /**
   * Generates issue suggestions for a given issue.
   * If the issue already has labels, returns undefined.
   * If similar issues exist, uses their label IDs for suggestions.
   * Otherwise, fetches suggested labels from OpenAI based on the issue description.
   * Upserts the issue suggestion with the suggested label IDs.
   * @param issue The issue to generate suggestions for.
   * @returns The upserted issue suggestion or undefined if the issue already has labels.
   */
  async issueSuggestions(issue: IssueWithRelations) {
    // If the issue already has labels, return undefined
    if (issue.labelIds.length >= 1) {
      this.logger.log(
        `Issue ${issue.id} already has labels, skipping suggestions.`,
      );
      return undefined;
    }

    // Fetch labels for the workspace or team, and similar issues
    const [labels, similarIssues] = await Promise.all([
      this.prisma.label.findMany({
        where: {
          OR: [
            { workspaceId: issue.team.workspaceId },
            { teamId: issue.teamId },
          ],
        },
      }),
      this.prisma.issueRelation.findMany({
        where: {
          relatedIssueId: issue.id,
          type: IssueRelationType.SIMILAR,
          deleted: null,
        },
        include: {
          issue: true,
        },
      }),
    ]);

    this.logger.log(
      `Fetched ${labels.length} labels and ${similarIssues.length} similar issues for issue ${issue.id}.`,
    );

    let labelIds: string[];

    // If similar issues exist, use their label IDs
    if (similarIssues.length > 0) {
      labelIds = similarIssues.flatMap(
        (similarIssue) => similarIssue.issue.labelIds,
      );
      this.logger.log(
        `Using label IDs from ${similarIssues.length} similar issues for issue ${issue.id}.`,
      );
    } else {
      // Otherwise, get suggested labels from OpenAI based on the issue description
      this.logger.log(
        `Fetching suggested labels from OpenAI for issue ${issue.id}.`,
      );
      const gptLabels = await getSuggestedLabels(
        this.prisma,
        this.aiRequestsService,
        labels.map((label) => label.name),
        issue.description,
        issue.team.workspaceId,
      );

      // Find the suggested labels in the database
      const suggestedLabels = await this.prisma.label.findMany({
        where: {
          name: { in: gptLabels.split(/,\s*/), mode: 'insensitive' },
          OR: [
            { workspaceId: issue.team.workspaceId },
            { teamId: issue.teamId },
          ],
        },
        select: { id: true },
      });

      // Extract the label IDs from the suggested labels
      labelIds = suggestedLabels.map((label) => label.id);
    }

    // Upsert the issue suggestion with the suggested label IDs
    // If the issue suggestion exists, update it; otherwise, create a new one
    const suggestion = await this.prisma.issueSuggestion.upsert({
      where: { issueId: issue.id },
      create: {
        issueId: issue.id,
        issue: { connect: { id: issue.id } },
        suggestedLabelIds: [...new Set(labelIds)], // Use a Set to ensure unique label IDs
      },
      update: {
        suggestedLabelIds: [...new Set(labelIds)], // Use a Set to ensure unique label IDs
      },
    });

    this.logger.log(
      `Upserted issue suggestion for issue ${issue.id} with ${suggestion.suggestedLabelIds.length} suggested labels.`,
    );

    // Return the upserted issue suggestion
    return suggestion;
  }

  /**
   * Deletes an issue suggestion by marking it as deleted.
   * @param issueId The ID of the issue associated with the suggestion.
   * @returns The updated issue suggestion with the deleted timestamp.
   */
  async deleteIssueSuggestion(issueId: string) {
    return await this.prisma.issueSuggestion.update({
      where: { issueId },
      data: { deleted: new Date().toISOString() },
    });
  }

  /**
   * Generates similar issue suggestions for a given issue in a workspace.
   * @param workspaceId The ID of the workspace.
   * @param issueId The ID of the issue to find similar issues for.
   * @returns An array of similar issues.
   */
  async similarIssueSuggestion(workspaceId: string, issueId: string) {
    // Find similar issues using the vector service
    const similarIssues = await this.vectorService.similarIssues(
      workspaceId,
      issueId,
    );

    // Create issue relations for each similar issue
    similarIssues.map(async (similarIssue) => {
      const relationData: IssueRelationInput = {
        type: IssueRelationType.SIMILAR,
        issueId,
        relatedIssueId: similarIssue.id,
      };

      // Create the issue relation using the issue relation service
      await this.issueRelationService.createIssueRelation(null, relationData);
    });

    return similarIssues;
  }

  /**
   * Generates similar issue suggestions for a given issue in a workspace.
   * @param workspaceId The ID of the workspace.
   * @param issueId The ID of the issue to find similar issues for.
   * @returns An array of similar issues.
   */
  async summarizeIssue(issueId: string) {
    // Fetch issue comments and their replies for the given issueId
    const issueComments = await this.prisma.issueComment.findMany({
      where: { issueId, deleted: null, parentId: null },
      orderBy: { createdAt: 'asc' },
      include: {
        replies: {
          where: { deleted: null },
          orderBy: { createdAt: 'asc' },
        },
        issue: { include: { team: true } },
      },
    });

    // If no comments are found, return undefined
    if (issueComments.length < 1) {
      return undefined;
    }

    // Fetch team users for the workspace and team associated with the issue
    const teamUsers = await this.prisma.usersOnWorkspaces.findMany({
      where: {
        workspaceId: issueComments[0].issue.team.workspaceId,
        teamIds: {
          hasSome: [issueComments[0].issue.teamId],
        },
      },
      include: { user: true },
    });

    // Create a mapping of user IDs to their full names
    const formattedTeamUsers: Record<string, string> = teamUsers.reduce(
      (acc: Record<string, string>, member) => {
        acc[member.user.id] = member.user.fullname;
        return acc;
      },
      {},
    );

    // Format comments and replies with user names
    const formattedComments = issueComments.map((comment) => {
      const sourceMetadata = comment.sourceMetadata as Record<string, string>;
      const userName =
        formattedTeamUsers[comment.userId] ||
        sourceMetadata?.userDisplayName ||
        null;
      const message = convertTiptapJsonToText(comment.body);
      const formattedReplies = comment.replies.map((reply) => {
        const replySourceMetadata = reply.sourceMetadata as Record<
          string,
          string
        >;
        const replyUserName =
          formattedTeamUsers[comment.userId] ||
          replySourceMetadata?.userDisplayName ||
          null;
        const replyMessage = convertTiptapJsonToText(reply.body);
        return `  Reply - ${replyUserName}: ${replyMessage}`;
      });
      return `Message - ${userName}: ${message}\n${formattedReplies.join('\n')}`;
    });

    // Generate a summary of the formatted comments using OpenAI
    const rawSummary = await getSummary(
      this.prisma,
      this.aiRequestsService,
      formattedComments.join('\n'),
      issueComments[0].issue.team.workspaceId,
    );

    // Extract bullet points from the raw summary using regex
    const bulletPointRegex = /- (.*)/g;
    const bulletPoints =
      rawSummary
        .match(bulletPointRegex)
        ?.map((point) => point.replace(/^- /, '').trim()) || [];

    // Return the extracted bullet points
    return bulletPoints;
  }

  /**
   * Generates an AI filter based on the provided team request parameters and filter input.
   * @param teamRequestParams - The team request parameters.
   * @param filterInput - The filter input containing the text and workspace ID.
   * @returns The generated AI filter.
   */
  async aiFilters(
    teamRequestParams: TeamRequestParams,
    filterInput: FilterInput,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Record<string, any>> {
    // Retrieve labels based on the provided workspace and team IDs
    const labels = await this.prisma.label.findMany({
      where: {
        OR: [
          { workspaceId: filterInput.workspaceId },
          { teamId: teamRequestParams.teamId },
        ],
      },
    });

    // Extract label names from the retrieved labels
    const labelNames = labels.map((label) => label.name);
    this.logger.debug(`Retrieved label names: ${labelNames}`);

    // Retrieve assignees based on the team ID
    const assignee = await this.prisma.usersOnWorkspaces.findMany({
      where: { teamIds: { has: teamRequestParams.teamId } },
      include: { user: true },
    });

    // Extract assignee names from the retrieved assignees
    const assigneeNames = assignee.map((assignee) => assignee.user.fullname);
    this.logger.debug(`Retrieved assignee names: ${assigneeNames}`);

    // Retrieve workflows based on the team ID
    const workflow = await this.prisma.workflow.findMany({
      where: { teamId: teamRequestParams.teamId },
    });

    // Extract workflow names from the retrieved workflows
    const workflowNames = workflow.map((workflow) => workflow.name);
    this.logger.debug(`Retrieved workflow names: ${workflowNames}`);

    // Retrieve the workspace based on the team ID
    const workspace = await getWorkspace(this.prisma, teamRequestParams.teamId);
    this.logger.debug(`Retrieved workspace: ${workspace.name}`);

    // Call the getAiFilter function with the necessary parameters
    const aiFilter = await getAiFilter(
      this.prisma,
      this.aiRequestsService,
      filterInput.text,
      {
        labelNames,
        assigneeNames,
        workflowNames,
      },
      workspace.id,
    );

    return aiFilter;
  }

  /**
   * Generates sub-issues based on the provided sub-issue input.
   * @param subIssueInput - The input data for generating sub-issues.
   * @returns An array of sub-issues containing title and description.
   */
  async generateSubIssues(
    subIssueInput: SubIssueInput,
  ): Promise<Array<{ title: string; description: string }>> {
    // Retrieve the sub-issue prompt based on the workspace ID
    const subIssuePrompt = await this.prisma.prompt.findFirst({
      where: { name: 'SubIssues', workspaceId: subIssueInput.workspaceId },
    });
    this.logger.debug(
      `Retrieved sub-issue prompt: ${JSON.stringify(subIssuePrompt)}`,
    );

    // Set default label names
    let labelNames: string[] = ['Frontend', 'Backend'];

    // If label IDs are provided, retrieve the corresponding label names
    if (subIssueInput.labelIds.length > 0) {
      labelNames = (
        await this.prisma.label.findMany({
          where: { id: { in: subIssueInput.labelIds } },
          select: { name: true },
        })
      ).map((label) => label.name);
    }
    this.logger.debug(`Label names for sub-issues: ${labelNames}`);

    // Generate sub-issues using the AI request service
    const subissues = await this.aiRequestsService.getLLMRequest({
      messages: [
        { role: 'system', content: subIssuePrompt.prompt },
        {
          role: 'user',
          content: `[INPUT] 
          description: ${subIssueInput.description}
          labels: ${JSON.stringify(labelNames)}`,
        },
      ],
      llmModel: LLMMappings[subIssuePrompt.model],
      model: 'SubIssues',
      workspaceId: subIssueInput.workspaceId,
    });
    this.logger.debug(`Generated sub-issues: ${subissues}`);

    // Extract sub-issue titles using regex
    const regex = /sub_issues:\s*\[(.*?)\]/s;
    const match = subissues.match(regex);

    if (match && match[1]) {
      const subIssueTitles = JSON.parse(`[${match[1]}]`);

      this.logger.debug(`Extracted sub-issue titles: ${subIssueTitles}`);

      return subIssueTitles;
    }

    this.logger.debug(
      `No sub-issues found in the generated content: ${subissues}`,
    );
    return [];
  }

  /**
   * Generates an AI-based title for an issue based on the provided AI input.
   * @param aiInput - The AI input containing the issue description and workspace ID.
   * @returns The generated AI-based title for the issue.
   */
  async aiTitle(aiInput: AIInput) {
    return await getIssueTitle(
      this.prisma,
      this.aiRequestsService,
      { description: aiInput.description } as CreateIssueInput,
      aiInput.workspaceId,
    );
  }

  async getDescriptionStream(
    descriptionInput: DescriptionInput,
    response: Response,
  ) {
    try {
      const descriptionPrompt = await this.prisma.prompt.findUnique({
        where: {
          name_workspaceId: {
            name: 'IssueDescription',
            workspaceId: descriptionInput.workspaceId,
          },
        },
      });
      const responseStream = await this.aiRequestsService.LLMRequestStream({
        messages: [
          { role: 'system', content: descriptionPrompt.prompt },
          {
            role: 'user',
            content: `[INPUT] short_description: ${descriptionInput.description}
                user_input: ${descriptionInput.userInput}`,
          },
        ],
        llmModel: LLMMappings[descriptionPrompt.model],
        model: 'IssueDescrptionStream',
        workspaceId: descriptionInput.workspaceId,
      });

      response.setHeader('Content-Type', 'text/event-stream');
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Connection', 'keep-alive');

      for await (const textPart of responseStream.textStream) {
        response.write(textPart);
      }

      response.end();
    } catch (error) {
      console.error('Error in callingFunction:', error);
      response.status(500).end('Internal Server Error');
    }
  }
}
