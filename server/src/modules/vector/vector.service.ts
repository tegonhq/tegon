/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CohereClient } from 'cohere-ai';
import { PrismaService } from 'nestjs-prisma';
import { Client as TypesenseClient } from 'typesense';

import { convertTiptapJsonToText } from 'common/utils/tiptap.utils';

import { IssueWithRelations } from 'modules/issues/issues.interface';

import {
  cohereEmbedding,
  issueSchema,
  typesenseEmbedding,
} from './vector.interface';

@Injectable()
export class VectorService implements OnModuleInit {
  private readonly cohereClient: CohereClient;
  private readonly isCohere: boolean;

  constructor(
    private prisma: PrismaService,
    private typesenseClient: TypesenseClient,
  ) {
    this.cohereClient = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });
    this.isCohere = process.env.COHERE_API_KEY ? true : false;
  }

  private readonly logger: Logger = new Logger('VectorService');

  async onModuleInit() {
    await this.typesenseClient.collections('issues').delete();
    await this.createIssuesCollection();
  }

  async createIssuesCollection() {
    try {
      await this.typesenseClient.collections('issues').retrieve();
      this.logger.log('Issues collection already exists');
    } catch (error) {
      if (error.httpStatus === 404) {
        issueSchema.fields.push(
          this.isCohere ? cohereEmbedding : typesenseEmbedding,
        );

        await this.typesenseClient.collections().create(issueSchema);
        this.logger.log('Created an issue collection');
        const workspaces = await this.prisma.workspace.findMany({
          where: { deleted: null, id: '4275cfab-2e36-4c08-a7e5-73555a3aaf62' },
          select: { id: true },
        });
        await Promise.all(
          workspaces.map((workspace) => this.prefillIssuesData(workspace.id)),
        );
        this.logger.log('Prefilled data for all workspaces');
      } else {
        this.logger.error('Error creating issues collection:', error);
      }
    }
  }

  async createIssueEmbedding(issue: IssueWithRelations) {
    const issueNumber = `${issue.team.identifier}-${issue.number}`;

    // // Prepare the input text for embedding
    const inputText = `${issueNumber}_${issue.title}_${convertTiptapJsonToText(issue.description)}`;

    let embedding: Record<string, Float32Array>;
    if (this.isCohere) {
      const cohereEmbed = await this.cohereClient.embed({
        texts: [inputText],
        model: 'embed-english-v3.0',
        inputType: 'search_query',
        embeddingTypes: ['float'],
      });

      embedding = cohereEmbed.embeddings as Record<string, Float32Array>;
    }

    await this.typesenseClient
      .collections('issues')
      .documents()
      .upsert({
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
        ...(this.isCohere && { embeddings: embedding.float[0] }),
      });
  }

  async searchEmbeddings(
    workspaceId: string,
    searchQuery: string,
    limit: number,
    vectorDistance: number = 0.8,
  ) {
    if (isNaN(vectorDistance)) {
      vectorDistance = 0.8; // Set a default value if vectorDistance is NaN
    }

    let queryBy = 'numberString,issueNumber,title,descriptionString,embeddings';
    let embedding: Record<string, Float32Array>;
    let vectorQuery = `embeddings:([], distance_threshold:${vectorDistance})`;
    if (this.isCohere) {
      const cohereEmbed = await this.cohereClient.embed({
        texts: [searchQuery],
        model: 'embed-english-v3.0',
        inputType: 'search_query',
        embeddingTypes: ['float'],
      });

      embedding = cohereEmbed.embeddings as Record<string, Float32Array>;
      queryBy = 'numberString,issueNumber,title,descriptionString,';
      vectorQuery = `embeddings:([${embedding.float[0]}], distance_threshold:${vectorDistance})`;
    }

    const searchParameters = {
      searches: [
        {
          collection: 'issues',
          q: '*',
          query_by: queryBy,
          filter_by: `workspaceId:=${workspaceId}`,
          sort_by: '_text_match:desc',
          vector_query: vectorQuery,
          exclude_fields: 'embeddings',
          page: 1,
          per_page: limit,
        },
      ],
    };

    const searchResults =
      await this.typesenseClient.multiSearch.perform(searchParameters);

    const hits = searchResults.results
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map(({ hits }: any) =>
        hits?.map(
          ({
            document: {
              id,
              title,
              description,
              stateId,
              teamId,
              number,
              issueNumber,
              descriptionString,
            },
            vector_distance,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }: any) => ({
            id,
            title,
            description,
            descriptionString,
            stateId,
            teamId,
            number,
            issueNumber,
            distance: vector_distance,
          }),
        ),
      )
      .flat();

    if (this.isCohere && hits.length > 1 && searchQuery) {
      const documents = hits.map((hit) => ({
        text: `${hit.issueNumber}_${hit.title}_${hit.descriptionString}`,
      }));

      const rerankResult = await this.cohereClient.rerank({
        documents,
        query: searchQuery,
        topN: hits.length,
        model: 'rerank-english-v3.0',
      });

      const relevanceThreshold = 0.1;
      const filteredResults = rerankResult.results.filter(
        ({ relevanceScore }) => relevanceScore >= relevanceThreshold,
      );

      // Rearrange hits based on the filtered rerankResult
      const rerankedHits = filteredResults.map(({ index, relevanceScore }) => ({
        ...hits[index],
        relevanceScore,
      }));

      return rerankedHits;
    }
    return hits;
  }

  async similarIssues(workspaceId: string, issueId: string) {
    const searchRequests = {
      searches: [
        {
          collection: 'issues',
          q: '*',
          vector_query: `embeddings:([], id: ${issueId},  distance_threshold:0.5)`,
          filter_by: `workspaceId:=${workspaceId}`,
          exclude_fields: 'embeddings',
          page: 1,
        },
      ],
    };

    const searchResults =
      await this.typesenseClient.multiSearch.perform(searchRequests);

    const hits = searchResults.results
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map(({ hits }: any) =>
        hits?.map(
          ({
            document: {
              id,
              title,
              description,
              stateId,
              teamId,
              number,
              issueNumber,
              descriptionString,
            },
            vector_distance,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }: any) => ({
            id,
            title,
            description,
            descriptionString,
            stateId,
            teamId,
            number,
            issueNumber,
            distance: vector_distance,
          }),
        ),
      )
      .flat();

    if (this.isCohere && hits.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const issueDoc: any = await this.typesenseClient
        .collections('issues')
        .documents(issueId)
        .retrieve();

      const similarQuery = `${issueDoc.issueNumber}_${issueDoc.title}_${issueDoc.descriptionString}`;

      const documents = hits.map((hit) => ({
        text: `${hit.issueNumber}_${hit.title}_${hit.descriptionString}`,
      }));

      const rerankResult = await this.cohereClient.rerank({
        documents,
        query: similarQuery,
        topN: hits.length,
        model: 'rerank-english-v3.0',
      });

      const relevanceThreshold = 0.9;
      const filteredResults = rerankResult.results.filter(
        ({ relevanceScore }) => relevanceScore >= relevanceThreshold,
      );

      // Rearrange hits based on the filtered rerankResult
      const rerankedHits = filteredResults.map(({ index, relevanceScore }) => ({
        ...hits[index],
        relevanceScore,
      }));

      return rerankedHits;
    }

    return hits;
  }

  async prefillIssuesData(workspaceId: string) {
    const issues = await this.prisma.issue.findMany({
      where: { team: { workspaceId }, deleted: null },
      include: { team: true },
    });

    for (const issue of issues) {
      await this.createIssueEmbedding(issue);

      // Add a random timeout between 500ms to 1000ms
      const randomTimeout = Math.floor(Math.random() * 501) + 500;
      await new Promise((resolve) => setTimeout(resolve, randomTimeout));
    }

    this.logger.log(
      `Prefilled all issues data into vector for workspaceId: ${workspaceId}`,
    );
  }
}
