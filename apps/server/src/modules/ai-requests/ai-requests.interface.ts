import { CoreMessage } from 'ai';

export interface requestInputBody {
  messages: CoreMessage[];
  model: string;
  workspaceId: string;
  llmModel: string;
}
