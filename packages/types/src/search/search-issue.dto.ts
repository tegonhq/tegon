export interface SearchIssueDto {
  query: string;
  workspaceId: string;
  limit?: number;
  vectorDistance?: number;
}
