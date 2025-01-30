export interface SupportType {
  id: string;
  createdAt: string;
  updatedAt: string;

  reportedById?: string;
  actualFrtAt?: string;
  firstResponseAt?: string;
  nextResponseAt?: string;
  resolvedAt?: string;
  slaDueBy?: string;
  metadata?: string;
  issueId: string;
}
