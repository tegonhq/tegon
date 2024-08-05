import { IssueRelationEnum } from '@tegonhq/types';
import { IsString } from 'class-validator';

export enum ReverseIssueRelationType {
  BLOCKS = 'BLOCKED',
  BLOCKED = 'BLOCKS',
  RELATED = 'RELATED',
  DUPLICATE = 'DUPLICATE_OF',
  DUPLICATE_OF = 'DUPLICATE',
  SIMILAR = 'SIMILAR',
}

export interface IssueRelationInput {
  type: IssueRelationEnum;
  issueId: string;
  relatedIssueId: string;
}

export class IssueRelationIdRequestParams {
  @IsString()
  issueRelationId: string;
}
