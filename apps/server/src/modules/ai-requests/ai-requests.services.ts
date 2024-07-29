import { openai } from '@ai-sdk/openai';
import { Injectable, Logger } from '@nestjs/common';
import { streamText } from 'ai';
import { PrismaService } from 'nestjs-prisma';
import { Ollama } from 'ollama';
import { createOllama } from 'ollama-ai-provider';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index';

import { requestInputBody } from './ai-requests.interface';

@Injectable()
export default class AIRequestsService {
  private readonly logger: Logger = new Logger('RequestsService');
  private readonly openaiClient;
  private readonly ollama;
  constructor(private prisma: PrismaService) {
    if (process.env['OPENAI_API_KEY']) {
      this.openaiClient = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'],
      });
    } else {
      const ollama = new Ollama({ host: process.env['OLLAMA_HOST'] });
      ollama.pull({ model: process.env['LOCAL_MODEL'] });

      this.ollama = createOllama({ baseURL: process.env['OLLAMA_HOST'] });
    }
  }

  async getLLMRequest(reqBody: requestInputBody) {
    let message: string | null;
    // const messages = reqBody.messages;
    let model = reqBody.llmModel;
    this.logger.log(`Received request with model: ${model}`);
    if (!process.env['OPENAI_API_KEY']) {
      this.logger.log('OPENAI_API_KEY not found, using local model');
      model = process.env['LOCAL_MODEL'];
    }
    switch (model) {
      case 'gpt-3.5-turbo':
      case 'gpt-4-turbo':
      case 'gpt-4o':
        // Send request to OpenAI
        this.logger.log(`Sending request to OpenAI with model: ${model}`);
        const chatCompletion: OpenAI.Chat.ChatCompletion =
          await this.openaiClient.chat.completions.create({
            messages: reqBody.messages as ChatCompletionMessageParam[],
            model,
          });
        message = chatCompletion.choices[0].message.content;
        break;
      default:
      // // Send request to ollama as fallback
      // this.logger.log(`Sending request to ollama with model: ${model}`);
      // const response = await this.ollama.chat({
      //   model,
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   messages: messages as any,
      // });
      // message = response.message.content;
    }

    this.logger.log(`Saving request and response to database`);
    await this.prisma.aIRequest.create({
      data: {
        data: JSON.stringify(
          reqBody.messages.filter((message) => message.role === 'user'),
        ),
        modelName: reqBody.model,
        workspaceId: reqBody.workspaceId,
        response: message,
        successful: true,
        llmModel: model,
      },
    });

    return message;
  }

  async LLMRequestStream(reqBody: requestInputBody) {
    const messages = reqBody.messages;
    const model = reqBody.llmModel;
    this.logger.log(`Received request with model: ${model}`);

    try {
      switch (model) {
        case 'gpt-3.5-turbo':
        case 'gpt-4-turbo':
        case 'gpt-4o':
          // Send request to OpenAI
          this.logger.log(`Sending request to OpenAI with model: ${model}`);
          return await streamText({
            model: openai(model),
            messages,
          });

        default:
          this.logger.log(`Sending request to ollama with model: ${model}`);
          // Send request to ollama as fallback
          return await streamText({
            model: this.ollama(model),
            messages,
          });
      }

      // this.logger.log(`Saving request and response to database`);
      // await this.prisma.aIRequest.create({
      //   data: {
      //     data: JSON.stringify(
      //       reqBody.messages.filter((message) => message.role === 'user'),
      //     ),
      //     modelName: reqBody.model,
      //     workspaceId: reqBody.workspaceId,
      //     response: responseContent,
      //     successful: true,
      //     llmModel: model,
      //   },
      // });
    } catch (error) {
      this.logger.error(`Error in LLMRequestStream: ${error.message}`);
      throw error;
    }
  }
}
