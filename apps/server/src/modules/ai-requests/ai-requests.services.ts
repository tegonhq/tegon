import { openai } from '@ai-sdk/openai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetAIRequestDTO, AIStreamResponse } from '@tegonhq/types';
import { streamText, generateText, CoreMessage, CoreUserMessage } from 'ai';
import { PrismaService } from 'nestjs-prisma';
import { Ollama } from 'ollama';
import { ollama } from 'ollama-ai-provider';

@Injectable()
export default class AIRequestsService {
  private readonly logger: Logger = new Logger('RequestsService');
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    if (!configService.get('OPENAI_API_KEY')) {
      const ollama = new Ollama({ host: process.env['OLLAMA_HOST'] });
      ollama.pull({ model: process.env['LOCAL_MODEL'] });
    }
  }

  async getLLMRequest(reqBody: GetAIRequestDTO): Promise<string> {
    return (await this.LLMRequestStream(reqBody, false)) as string;
  }

  async getLLMRequestStream(
    reqBody: GetAIRequestDTO,
  ): Promise<AIStreamResponse> {
    return (await this.LLMRequestStream(reqBody, true)) as AIStreamResponse;
  }

  async LLMRequestStream(reqBody: GetAIRequestDTO, stream: boolean = true) {
    const messages = reqBody.messages;
    const userMessages = reqBody.messages.filter(
      (message: CoreMessage) => message.role === 'user',
    );
    const model = reqBody.llmModel;
    this.logger.log(`Received request with model: ${model}`);

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
            reqBody.workspaceId,
          );
        },
      );
    } catch (error) {
      this.logger.error(`Error in LLMRequestStream: ${error.message}`);
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
    let finalModel;

    if (!this.configService.get('OPENAI_API_KEY')) {
      model = null;
    }

    switch (model) {
      case 'gpt-3.5-turbo':
      case 'gpt-4-turbo':
      case 'gpt-4o':
        finalModel = model;
        this.logger.log(`Sending request to OpenAI with model: ${model}`);
        modelInstance = openai(model);
        break;
      default:
        finalModel = process.env.LOCAL_MODEL;
        this.logger.log(`Sending request to ollama with model: ${model}`);
        modelInstance = ollama(finalModel);
    }

    if (stream) {
      return await streamText({
        model: modelInstance,
        messages,
        onFinish: async ({ text }) => {
          onFinish(text, finalModel);
        },
      });
    }

    const { text } = await generateText({
      model: modelInstance,
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
    this.logger.log(`Saving request and response to database`);
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
