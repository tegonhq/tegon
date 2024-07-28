import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Ollama } from 'ollama';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { Observable } from 'rxjs';

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
      this.ollama = new Ollama({ host: process.env['OLLAMA_HOST'] });
      this.ollama.pull({ model: process.env['LOCAL_MODEL'] });
    }
  }

  async getLLMRequest(reqBody: requestInputBody) {
    let message: string | null;
    const messages = reqBody.messages;
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
        // Send request to ollama as fallback
        this.logger.log(`Sending request to ollama with model: ${model}`);
        const response = await this.ollama.chat({
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

  async LLMRequestStream(
    reqBody: requestInputBody,
  ): Promise<Observable<string>> {
    const messages = reqBody.messages;
    let model = reqBody.llmModel;
    this.logger.log(`Received request with model: ${model}`);

    try {
      const observable = new Observable<string>((subscriber) => {
        let responseContent = '';

        (async () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let stream: any;

          switch (model) {
            case 'gpt-3.5-turbo':
            case 'gpt-4-turbo':
            case 'gpt-4o':
              // Send request to OpenAI
              this.logger.log(`Sending request to OpenAI with model: ${model}`);
              stream = await this.openaiClient.chat.completions.create({
                model,
                messages: messages as ChatCompletionMessageParam[],
                stream: true,
              });

              /**  Iterate over the chunks received from the stream
              Extract the content from the chunk
              Append the content to the responseContent */
              for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta?.content || '';
                responseContent += delta;

                subscriber.next(delta);
              }

              break;

            default:
              // Send request to ollama as fallback
              model = process.env.LOCAL_MODEL;
              this.logger.log(`Sending request to ollama with model: ${model}`);
              const ollamaStream = await ollama.chat({
                model,
                messages,
                stream: true,
              });

              /**  Iterate over the chunks received from the stream
              Extract the content from the chunk
              Append the content to the responseContent */
              for await (const chunk of ollamaStream) {
                const delta = chunk.message.content || '';
                responseContent += delta;

                subscriber.next(delta);
              }
          }

          subscriber.complete();

          this.logger.log(`Saving request and response to database`);
          await this.prisma.aIRequest.create({
            data: {
              data: JSON.stringify(
                reqBody.messages.filter((message) => message.role === 'user'),
              ),
              modelName: reqBody.model,
              workspaceId: reqBody.workspaceId,
              response: responseContent,
              successful: true,
              llmModel: model,
            },
          });
        })();
      });

      return observable;
    } catch (error) {
      this.logger.error(`Error in LLMRequestStream: ${error.message}`);
      throw error;
    }
  }
}
