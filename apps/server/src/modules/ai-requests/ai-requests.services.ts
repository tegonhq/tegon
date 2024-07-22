import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import ollama from 'ollama';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

import { requestInputBody } from './ai-requests.interface';

@Injectable()
export default class AIRequestsService {
  private readonly logger: Logger = new Logger('RequestsService');
  private readonly openaiClient;
  constructor(private prisma: PrismaService) {
    if (process.env['OPENAI_API_KEY']) {
      this.openaiClient = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'],
      });
    } else {
      ollama.pull({ model: process.env['LOCAL_MODEL'] });
    }
  }

  async getLLMRequest(reqBody: requestInputBody) {
    let message: string | null;
    const messages = reqBody.messages;
    let model = reqBody.llmModel;
    this.logger.log(`Received request with model: ${model}`);
    switch (model) {
      case 'gpt-3.5-turbo':
      case 'gpt-4-turbo':
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
        // Send request to ollama as fallback
        model = process.env.LOCAL_MODEL;
        this.logger.log(`Sending request to ollama with model: ${model}`);
        const response = await ollama.chat({
          model,
          messages,
        });
        message = response.message.content;
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
}
