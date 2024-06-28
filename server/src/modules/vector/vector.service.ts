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
    // await this.typesenseClient.collections('issues').delete();
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
          where: { deleted: null },
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
    // Generate the issue number by combining team identifier and issue number
    const issueNumber = `${issue.team.identifier}-${issue.number}`;

    // Prepare the input text for embedding by concatenating issue number, title, and description
    const inputText = `${issueNumber}_${issue.title}_${convertTiptapJsonToText(issue.description)}`;

    let embedding: Record<string, Float32Array>;
    if (this.isCohere) {
      // Generate embeddings using Cohere API
      const cohereEmbed = await this.cohereClient.embed({
        texts: [inputText],
        model: 'embed-english-v3.0',
        inputType: 'search_query',
        embeddingTypes: ['float'],
      });

      // Extract the float embeddings from the Cohere response
      embedding = cohereEmbed.embeddings as Record<string, Float32Array>;
    }

    // Upsert the issue document in the Typesense 'issues' collection
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
        // Include the float embeddings in the document if using Cohere
        ...(this.isCohere && { embeddings: embedding.float[0] }),
      });
  }

  async searchEmbeddings(
    workspaceId: string,
    searchQuery: string,
    limit: number,
    vectorDistance: number = 0.8,
  ) {
    // Set a default value of 0.8 for vectorDistance if it is NaN
    if (isNaN(vectorDistance)) {
      vectorDistance = 0.8;
    }

    let queryBy = 'numberString,issueNumber,title,descriptionString,embeddings';
    let embedding: Record<string, Float32Array>;
    let vectorQuery = `embeddings:([], distance_threshold:${vectorDistance})`;

    // If using Cohere, embed the search query and update queryBy and vectorQuery
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

    // Define search parameters for Typesense multiSearch
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

    // Perform multiSearch using Typesense client
    const searchResults =
      await this.typesenseClient.multiSearch.perform(searchParameters);

    // Extract relevant fields from search results
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
              workspaceId,
              assigneeId,
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
            workspaceId,
            assigneeId,
            distance: vector_distance,
          }),
        ),
      )
      .flat();

    // If using Cohere and there are multiple hits, rerank the results
    if (this.isCohere && hits.length > 1 && searchQuery) {
      // Create an array of documents containing the issue number, title, and description
      const documents = hits.map((hit) => ({
        text: `${hit.issueNumber}_${hit.title}_${hit.descriptionString}`,
      }));

      // Rerank the documents using Cohere's rerank API
      const rerankResult = await this.cohereClient.rerank({
        documents,
        query: searchQuery,
        topN: hits.length,
        model: 'rerank-english-v3.0',
      });

      // Set a relevance threshold to filter out low-relevance results
      const relevanceThreshold = 0.1;
      // Filter and map the reranked results based on the relevance threshold
      const rerankedHits = rerankResult.results
        .filter(({ relevanceScore }) => relevanceScore >= relevanceThreshold)
        .map(({ index, relevanceScore }) => ({
          ...hits[index],
          relevanceScore,
        }));

      return rerankedHits;
    }

    return hits;
  }

  async similarIssues(workspaceId: string, issueId: string) {
    // Prepare the search request for Typesense
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

    // Perform the multi-search request to Typesense
    const searchResults =
      await this.typesenseClient.multiSearch.perform(searchRequests);

    // Extract the relevant fields from the search results
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
              workspaceId,
              assigneeId,
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
            workspaceId,
            assigneeId,
            distance: vector_distance,
          }),
        ),
      )
      .flat();

    // If using Cohere and there are search hits, perform reranking
    if (this.isCohere && hits.length > 0) {
      // Retrieve the issue document from Typesense
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const issueDoc: any = await this.typesenseClient
        .collections('issues')
        .documents(issueId)
        .retrieve();

      // Construct the query for reranking
      const similarQuery = `${issueDoc.issueNumber}_${issueDoc.title}_${issueDoc.descriptionString}`;

      // Prepare the documents for reranking
      const documents = hits.map(
        ({ issueNumber, title, descriptionString }) => ({
          text: `${issueNumber}_${title}_${descriptionString}`,
        }),
      );

      // Perform reranking using Cohere
      const { results: rerankResults } = await this.cohereClient.rerank({
        documents,
        query: similarQuery,
        topN: hits.length,
        model: 'rerank-english-v3.0',
      });

      // Filter and map the reranked results based on relevance score
      const relevanceThreshold = 0.9;
      const rerankedHits = rerankResults
        .filter(({ relevanceScore }) => relevanceScore >= relevanceThreshold)
        .map(({ index, relevanceScore }) => ({
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
    }

    this.logger.log(
      `Prefilled all issues data into vector for workspaceId: ${workspaceId}`,
    );
  }
}
