import AIRequestsService from 'modules/ai-requests/ai-requests.services';

import {
  CreateViewsRequestBody,
  viewNameDescriptionPrompt,
} from './views.interface';

export async function getViewNameDescription(
  aiRequestsService: AIRequestsService,
  filtersData: CreateViewsRequestBody,
  workspaceId: string,
): Promise<Record<string, string>> {
  const content = await aiRequestsService.getLLMRequest({
    messages: [
      { role: 'system', content: viewNameDescriptionPrompt },
      { role: 'user', content: JSON.stringify(filtersData.filters) },
    ],
    llmModel: 'gpt-3.5-turbo',
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
