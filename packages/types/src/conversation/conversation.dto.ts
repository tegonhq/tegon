import { IsString } from 'class-validator';

export class ConversationParamsDto {
  @IsString()
  conversationId: string;
}
