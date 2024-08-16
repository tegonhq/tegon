import { IsString } from 'class-validator';

export class GetLinkedCommentDto {
  @IsString()
  sourceId: string;
}
