export interface LinkedIssueType {
  id: string;
  createdAt: string;
  updatedAt: string;

  url: string;
  sourceId?: string;
  source: string;
  sourceData: string;
  issueId: string;
  createdById: string;
}
