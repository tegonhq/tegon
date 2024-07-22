export interface requestMessage {
  role: string;
  content: string;
}

export interface requestInputBody {
  messages: requestMessage[];
  model: string;
  workspaceId: string;
  llmModel: string;
}
