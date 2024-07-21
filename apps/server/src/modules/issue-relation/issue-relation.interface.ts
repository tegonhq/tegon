import { IsString } from 'class-validator';

export enum IssueRelationType {
  BLOCKS = 'BLOCKS',
  BLOCKED = 'BLOCKED',
  RELATED = 'RELATED',
  DUPLICATE = 'DUPLICATE',
  DUPLICATE_OF = 'DUPLICATE_OF',
  SIMILAR = 'SIMILAR',
}

export enum ReverseIssueRelationType {
  BLOCKS = 'BLOCKED',
  BLOCKED = 'BLOCKS',
  RELATED = 'RELATED',
  DUPLICATE = 'DUPLICATE_OF',
  DUPLICATE_OF = 'DUPLICATE',
  SIMILAR = 'SIMILAR',
}

export interface IssueRelationInput {
  type: IssueRelationType;
  issueId: string;
  relatedIssueId: string;
}

export class IssueRelationIdRequestParams {
  @IsString()
  issueRelationId: string;
}
