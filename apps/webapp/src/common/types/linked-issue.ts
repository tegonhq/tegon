export interface LinkedIssueType {
  id: string;
  createdAt: string;
  updatedAt: string;

  url: string;
  sourceId?: string;
  sourceData: string;
  issueId: string;
  createdById: string;
}
