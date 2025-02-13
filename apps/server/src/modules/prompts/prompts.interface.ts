import { LLMModelEnum, LLMModelType } from '@tegonhq/types';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class PromptInput {
  @IsString()
  name: string;

  @IsString()
  prompt: string;

  @IsOptional()
  @IsEnum(LLMModelEnum)
  models: LLMModelType;
}

export enum LLMMappings {
  GPT35TURBO = 'gpt-3.5-turbo',
  GPT4TURBO = 'gpt-4-turbo',
  LLAMA3 = 'llama3',
  CLAUDEOPUS = 'opus',
  GPT4O = 'gpt-4o',
}
