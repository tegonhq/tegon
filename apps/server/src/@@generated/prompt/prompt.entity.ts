import { Workspace } from '../workspace/entities/workspace.entity';

export enum LLMModels {
  GPT35TURBO = 'GPT35TURBO',
  GPT4TURBO = 'GPT4TURBO',
  LLAMA3 = 'LLAMA3',
  CLAUDEOPUS = 'CLAUDEOPUS',
  GPT4O = 'GPT4O',
}

export class Prompt {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  name: string;
  prompt: string;
  model: LLMModels;
  workspace?: Workspace;
  workspaceId: string;
}
