/** Copyright (c) 2024, Tegon, all rights reserved. **/

import OpenAI from 'openai';

import {
  CreateViewsRequestBody,
  viewNameDescriptionPrompt,
} from './views.interface';

export async function getViewNameDescription(
  openaiClient: OpenAI,
  filtersData: CreateViewsRequestBody,
): Promise<Record<string, string>> {
  const chatCompletion: OpenAI.Chat.ChatCompletion =
    await openaiClient.chat.completions.create({
      messages: [
        { role: 'system', content: viewNameDescriptionPrompt },
        { role: 'user', content: JSON.stringify(filtersData.filters) },
      ],
      model: 'gpt-3.5-turbo',
    });
  const content = chatCompletion.choices[0].message.content;
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
