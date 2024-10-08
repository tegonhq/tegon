export interface SearchIssuesDto {
  query: string;
  workspaceId: string;
  limit?: number;
  vectorDistance?: number;
}
