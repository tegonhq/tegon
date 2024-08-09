// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkedIssueSource = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkedIssueSourceData = Record<string, any>;

export interface CreateLinkIssueInput {
  url: string;
  issueId: string;
  createdById: string;
  sourceId?: string;
  source?: LinkedIssueSource;
  sourceData?: LinkedIssueSourceData;
}

export class LinkIssueInput {
  url: string;
  type?: string;
  title?: string;
  subType?: string;
}
