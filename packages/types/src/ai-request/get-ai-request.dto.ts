import { CoreMessage } from 'ai';

export interface GetAIRequestDTO {
  messages: CoreMessage[];
  model: string;
  workspaceId: string;
  llmModel: string;
}
