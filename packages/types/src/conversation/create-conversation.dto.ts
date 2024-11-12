import { IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  userId: string;

  @IsString()
  workspaceId: string;
}
