import { openai } from '@ai-sdk/openai';
import { Injectable, Logger } from '@nestjs/common';
import { streamText, generateText } from 'ai';
import { PrismaService } from 'nestjs-prisma';
import { Ollama } from 'ollama';
import { createOllama } from 'ollama-ai-provider';

import { requestInputBody } from './ai-requests.interface';

@Injectable()
export default class AIRequestsService {
  private readonly logger: Logger = new Logger('RequestsService');
  private readonly ollama;
  constructor(private prisma: PrismaService) {
    if (!process.env['OPENAI_API_KEY']) {
      const ollama = new Ollama({ host: process.env['OLLAMA_HOST'] });
      ollama.pull({ model: process.env['LOCAL_MODEL'] });

      this.ollama = createOllama({ baseURL: process.env['OLLAMA_HOST'] });
    }
  }

  async getLLMRequest(reqBody: requestInputBody) {
    return await this.LLMRequestStream(reqBody, false);
  }

  async LLMRequestStream(reqBody: requestInputBody, stream: boolean = true) {
    const messages = reqBody.messages;
    const model = reqBody.llmModel;
    this.logger.log(`Received request with model: ${model}`);
    const generateFunction = stream ? streamText : generateText;
    try {
      switch (model) {
        case 'gpt-3.5-turbo':
        case 'gpt-4-turbo':
        case 'gpt-4o':
          // Send request to OpenAI
          this.logger.log(`Sending request to OpenAI with model: ${model}`);
          return await generateFunction({
            model: openai(model),
            messages,
          });

        default:
          this.logger.log(`Sending request to ollama with model: ${model}`);
          // Send request to ollama as fallback
          return await generateFunction({
            model: this.ollama(process.env.LOCAL_MODEL),
            messages,
          });
      }
    } catch (error) {
      this.logger.error(`Error in LLMRequestStream: ${error.message}`);
      throw error;
    }
  }
}
