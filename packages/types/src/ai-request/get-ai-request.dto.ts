// TODO: use CoreMessage from ai but it is throwing compile error
export interface GetAIRequestDTO {
  messages: any[];
  model: string;
  workspaceId: string;
  llmModel: string;
}
