import AIRequestsService from 'modules/ai-requests/ai-requests.services';

import { CreateViewsRequestBody } from './views.interface';
import { PrismaService } from 'nestjs-prisma';
import { LLMMappings } from 'modules/prompts/prompts.interface';

export async function getViewNameDescription(
  prisma: PrismaService,
  aiRequestsService: AIRequestsService,
  filtersData: CreateViewsRequestBody,
  workspaceId: string,
): Promise<Record<string, string>> {
  const viewNameDescriptionPrompt = await prisma.prompt.findFirst({
    where: { name: 'ViewNameDescription', workspaceId },
  });
  const content = await aiRequestsService.getLLMRequest({
    messages: [
      { role: 'system', content: viewNameDescriptionPrompt.prompt },
      { role: 'user', content: JSON.stringify(filtersData.filters) },
    ],
    llmModel: LLMMappings[viewNameDescriptionPrompt.model],
    model: 'ViewNameDescription',
    workspaceId,
  });
  const viewNameRegex = /viewName:\s*(.*)/i;
  const viewDescriptionRegex = /viewDescription:\s*(.*)/i;

  const viewNameMatch = content.match(viewNameRegex);
  const viewDescriptionMatch = content.match(viewDescriptionRegex);

  const viewName = viewNameMatch ? viewNameMatch[1].trim() : '';
  const viewDescription = viewDescriptionMatch
    ? viewDescriptionMatch[1].trim()
    : '';

  return {
    name: viewName,
    description: viewDescription,
  };
}
