export interface SearchDto {
  query: string;
  workspaceId: string;
  limit?: number;
  vectorDistance?: number;
}
