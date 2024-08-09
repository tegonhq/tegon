import { CreateIssueDto, UpdateIssueDto } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import AIRequestsService from 'modules/ai-requests/ai-requests.services';
import { LLMMappings } from 'modules/prompts/prompts.interface';

export async function getIssueTitle(
  prisma: PrismaService,
  aiRequestsService: AIRequestsService,
  issueData: CreateIssueDto | UpdateIssueDto,
  workspaceId: string,
): Promise<string> {
  if (issueData.title) {
    return issueData.title;
  } else if (issueData.description) {
    const titlePrompt = await prisma.prompt.findFirst({
      where: { name: 'IssueTitle', workspaceId },
    });
    return await aiRequestsService.getLLMRequest({
      messages: [
        { role: 'system', content: titlePrompt.prompt },
        { role: 'user', content: issueData.description },
      ],
      llmModel: LLMMappings[titlePrompt.model],
      model: 'IssueTitle',
      workspaceId,
    });
  }
  return '';
}

export async function getAiFilter(
  prisma: PrismaService,
  aiRequestsService: AIRequestsService,
  filterText: string,
  filterData: Record<string, string[]>,
  workspaceId: string,
) {
  const aiFilterPrompt = await prisma.prompt.findFirst({
    where: { name: 'Filter', workspaceId },
  });
  const filterPrompt = aiFilterPrompt.prompt
    .replace('{{status}}', filterData.workflowNames.join(', '))
    .replace('{{assignee}}', filterData.assigneeNames.join(', '))
    .replace('{{label}}', filterData.labelNames.join(', '));

  try {
    const response = await aiRequestsService.getLLMRequest({
      messages: [
        { role: 'system', content: filterPrompt },
        { role: 'user', content: filterText },
      ],
      llmModel: LLMMappings[aiFilterPrompt.model],
      model: 'AIFilters',
      workspaceId,
    });
    return JSON.parse(response);
  } catch (error) {
    return {};
  }
}

export async function getSuggestedLabels(
  prisma: PrismaService,
  aiRequestsService: AIRequestsService,
  labels: string[],
  description: string,
  workspaceId: string,
) {
  const labelPrompt = await prisma.prompt.findUnique({
    where: { name_workspaceId: { name: 'IssueLabels', workspaceId } },
  });
  return await aiRequestsService.getLLMRequest({
    messages: [
      { role: 'system', content: labelPrompt.prompt },
      {
        role: 'user',
        content: `Text Description  -  ${description} \n Company Specific Labels -  ${labels.join(',')}`,
      },
    ],
    llmModel: LLMMappings[labelPrompt.model],
    model: 'LabelSuggestion',
    workspaceId,
  });
}

export async function getSummary(
  prisma: PrismaService,
  aiRequestsService: AIRequestsService,
  conversations: string,
  workspaceId: string,
) {
  const summarizePrompt = await prisma.prompt.findFirst({
    where: { name: 'IssueSummary', workspaceId },
  });
  return await aiRequestsService.getLLMRequest({
    messages: [
      { role: 'system', content: summarizePrompt.prompt },
      {
        role: 'user',
        content: `[INPUT] conversations: ${conversations}`,
      },
    ],
    llmModel: LLMMappings[summarizePrompt.model],
    model: 'IssueSummary',
    workspaceId,
  });
}
