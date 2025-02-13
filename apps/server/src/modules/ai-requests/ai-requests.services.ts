import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIStreamResponse, GetAIRequestDTO } from '@tegonhq/types';
import {
  CoreMessage,
  CoreUserMessage,
  generateText,
  LanguageModelV1,
  streamText,
} from 'ai';
import { PrismaService } from 'nestjs-prisma';
import { Ollama } from 'ollama';
import { ollama } from 'ollama-ai-provider';

import { LoggerService } from 'modules/logger/logger.service';

@Injectable()
export default class AIRequestsService {
  private readonly logger: LoggerService = new LoggerService('RequestsService');
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    if (
      !configService.get('OPENAI_API_KEY') ||
      !configService.get('ANTHROPIC_API_KEY')
    ) {
      const ollama = new Ollama({ host: process.env['OLLAMA_HOST'] });
      ollama.pull({ model: process.env['LOCAL_MODEL'] });
    }
  }

  async getLLMRequest(
    reqBody: GetAIRequestDTO,
    workspaceId: string,
  ): Promise<string> {
    return (await this.LLMRequestStream(reqBody, workspaceId, false)) as string;
  }

  async getLLMRequestStream(
    reqBody: GetAIRequestDTO,
    workspaceId: string,
  ): Promise<AIStreamResponse> {
    return (await this.LLMRequestStream(
      reqBody,
      workspaceId,
      true,
    )) as AIStreamResponse;
  }

  async LLMRequestStream(
    reqBody: GetAIRequestDTO,
    workspaceId: string,
    stream: boolean = true,
  ) {
    const messages = reqBody.messages;
    const userMessages = reqBody.messages.filter(
      (message: CoreMessage) => message.role === 'user',
    );
    const model = reqBody.llmModel;
    this.logger.info({
      message: `Received request with model: ${model}`,
      payload: { userMessages },
      where: `AIRequestsService.LLMRequestStream`,
    });

    try {
      return await this.makeModelCall(
        stream,
        model,
        messages,
        (text: string, model: string) => {
          this.createRecord(
            text,
            userMessages,
            model,
            reqBody.model,
            workspaceId,
          );
        },
      );
    } catch (error) {
      this.logger.error({
        message: `Error in LLMRequestStream: ${error.message}`,
        where: `AIRequestsService.LLMRequestStream`,
        error,
      });
      throw error;
    }
  }

  async makeModelCall(
    stream: boolean,
    model: string,
    messages: CoreMessage[],
    onFinish: (text: string, model: string) => void,
  ) {
    let modelInstance;
    let finalModel: string;
    if (
      !this.configService.get('OPENAI_API_KEY') ||
      !this.configService.get('ANTHROPIC_API_KEY')
    ) {
      model = null;
    }

    switch (model) {
      case 'gpt-3.5-turbo':
      case 'gpt-4-turbo':
      case 'gpt-4o':
        finalModel = model;
        this.logger.info({
          message: `Sending request to OpenAI with model: ${finalModel}`,
          where: `AIRequestsService.makeModelCall`,
        });
        modelInstance = openai(finalModel);
        break;

      case 'claude-3-opus-20240229':
      case 'claude-3-5-sonnet-20241022':
      case 'claude-3-haiku-20240307':
        finalModel = model;
        this.logger.info({
          message: `Sending request to Claude with model: ${finalModel}`,
          where: `AIRequestsService.makeModelCall`,
        });
        modelInstance = anthropic(finalModel);
        break;

      default:
        finalModel = process.env.LOCAL_MODEL;
        this.logger.info({
          message: `Sending request to ollama with model: ${model}`,
          where: `AIRequestsService.makeModelCall`,
        });
        modelInstance = ollama(finalModel);
    }

    if (stream) {
      return await streamText({
        model: modelInstance as LanguageModelV1,
        messages,
        onFinish: async ({ text }) => {
          onFinish(text, finalModel);
        },
      });
    }

    const { text } = await generateText({
      model: modelInstance as LanguageModelV1,
      messages,
    });

    onFinish(text, finalModel);

    return text;
  }

  async createRecord(
    message: string,
    userMessages: CoreUserMessage[],
    model: string,
    serviceModel: string,
    workspaceId: string,
  ) {
    this.logger.info({
      message: `Saving request and response to database`,
      where: `AIRequestsService.createRecord`,
    });
    await this.prisma.aIRequest.create({
      data: {
        data: JSON.stringify(userMessages),
        modelName: serviceModel,
        workspaceId,
        response: message,
        successful: true,
        llmModel: model,
      },
    });
  }
}
