/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Client as ElasticsearchClient } from '@elastic/elasticsearch';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { convertTiptapJsonToText } from 'common/utils/tiptap.utils';

import { IssueWithRelations } from 'modules/issues/issues.interface';

@Injectable()
export class VectorService implements OnModuleInit {
  private readonly logger: Logger = new Logger('VectorService');
  private readonly elasticsearchClient: ElasticsearchClient;

  constructor(private prisma: PrismaService) {
    this.elasticsearchClient = new ElasticsearchClient({
      cloud: {
        id: process.env.ELASTICSEARCH_CLOUD_ID,
      },
      auth: {
        apiKey: process.env.ELASTICSEARCH_API_KEY,
      },
    });
  }

  async onModuleInit() {
    // await this.createIssuesIndex();
    // await this.createCohereEmbeddingInference();
    // await this.prefillIssuesData('4275cfab-2e36-4c08-a7e5-73555a3aaf62');
    await this.reindex();
  }

  async createIssuesIndex() {
    try {
      await this.elasticsearchClient.indices.create({
        index: 'issues',
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              teamId: { type: 'keyword' },
              number: { type: 'integer' },
              numberString: { type: 'keyword' },
              issueNumber: { type: 'keyword' },
              title: { type: 'text' },
              description: { type: 'text' },
              descriptionString: { type: 'text' },
              stateId: { type: 'keyword' },
              workspaceId: { type: 'keyword' },
              assigneeId: { type: 'keyword' },
              embedding: { type: 'dense_vector', dims: 1024 },
            },
          },
        },
      });
      this.logger.log('Created issues index');
    } catch (error) {
      this.logger.error('Error creating issues index:', error);
    }
  }

  async createCohereEmbeddingInference() {
    try {
      //   await this.elasticsearchClient.ml.putTrainedModel({
      //     model_id: 'cohere_embeddings',
      //     body: {
      //       description: 'Cohere embeddings model',
      //       model_type: 'pytorch',
      //       inference_config: {
      //         pass_through: {
      //           tokenization: {
      //             bert: {
      //               with_special_tokens: false,
      //             },
      //           },
      //         },
      //       },
      //     },
      //   });

      //   await this.elasticsearchClient.ml.putTrainedModelAlias({
      //     model_id: 'cohere_embeddings',
      //     model_alias: 'cohere_embeddings_alias',
      //   });

      await this.elasticsearchClient.ml.startTrainedModelDeployment({
        model_id: 'cohere_embeddings',
      });

      this.logger.log('Created Cohere embedding inference');
    } catch (error) {
      this.logger.error('Error creating Cohere embedding inference:', error);
    }
  }

  async createIssueEmbedding(issue: IssueWithRelations) {
    const issueNumber = `${issue.team.identifier}-${issue.number}`;
    const inputText = `${issueNumber} ${issue.title} ${convertTiptapJsonToText(issue.description)}`;

    console.log(inputText);
    // Index the issue document without the ingest pipeline
    await this.elasticsearchClient.index({
      index: 'issues',
      id: issue.id,
      body: {
        id: issue.id,
        teamId: issue.teamId,
        number: issue.number,
        numberString: issue.number.toString(),
        issueNumber,
        title: issue.title,
        description: issue.description ?? '',
        descriptionString: convertTiptapJsonToText(issue.description),
        stateId: issue.stateId,
        workspaceId: issue.team.workspaceId,
        assigneeId: issue.assigneeId ?? '',
        input_text: inputText,
      },
    });
  }

  async reindex() {
    // Create an ingest pipeline for Cohere embeddings
    await this.elasticsearchClient.ingest.putPipeline({
      id: 'cohere_embeddings_pipeline',
      body: {
        processors: [
          {
            inference: {
              model_id: 'cohere_embeddings',
              field_map: {
                input_text: 'INPUT_FIELD',
              },
              target_field: 'embedding',
            },
          },
        ],
      },
    });

    // Reindex the issues using the ingest pipeline
    await this.elasticsearchClient.reindex({
      body: {
        source: {
          index: 'issues',
        },
        dest: {
          index: 'issues',
          pipeline: 'cohere_embeddings_pipeline',
        },
      },
    });
  }

  async searchEmbeddings(
    workspaceId: string,
    searchQuery: string,
    limit: number,
  ) {
    const searchResponse = await this.elasticsearchClient.search({
      index: 'issues',
      body: {
        knn: {
          field: 'embedding',
          query_vector_builder: {
            text_embedding: {
              model_id: 'cohere_embeddings',
              model_text: searchQuery,
            },
          },
          k: limit,
          num_candidates: 100,
        },
        _source: [
          'id',
          'title',
          'description',
          'stateId',
          'teamId',
          'number',
          'issueNumber',
          'assigneeId',
        ],
        query: {
          bool: {
            filter: [
              {
                term: {
                  workspaceId,
                },
              },
            ],
          },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return searchResponse.hits.hits.map((hit: any) => ({
      id: hit._source.id,
      title: hit._source.title,
      description: hit._source.description,
      stateId: hit._source.stateId,
      teamId: hit._source.teamId,
      number: hit._source.number,
      issueNumber: hit._source.issueNumber,
      assigneeId: hit._source.assigneeId,
      score: hit._score,
    }));
  }

  async prefillIssuesData(workspaceId: string) {
    const issues = await this.prisma.issue.findMany({
      where: { team: { workspaceId }, deleted: null },
      include: { team: true },
    });

    for (const issue of issues) {
      await this.createIssueEmbedding(issue);
    }

    this.logger.log(
      `Prefilled all issues data into vector for workspaceId: ${workspaceId}`,
    );
  }
}
