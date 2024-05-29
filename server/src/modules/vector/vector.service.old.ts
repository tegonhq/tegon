/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Client as TypesenseClient } from 'typesense';

import { convertTiptapJsonToText } from 'common/utils/tiptap.utils';

import { IssueWithRelations } from 'modules/issues/issues.interface';

import { issueSchema } from './vector.interface';

@Injectable()
export class VectorService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private typesenseClient: TypesenseClient,
  ) {}

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
    // const inputText = `${issueNumber} ${issue.title} ${convertTiptapJsonToText(issue.description)}`;

    // // Make a request to OpenAI's embedding API
    // const embeddingResponse = await fetch(
    //   'https://api.openai.com/v1/embeddings',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    //     },
    //     body: JSON.stringify({
    //       input: inputText,
    //       model: 'text-embedding-3-small',
    //     }),
    //   },
    // );

    // const embeddingData = await embeddingResponse.json();
    // const embedding = embeddingData.data[0].embedding;

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
        // embeddings: embedding,
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

    // const embeddingResponse = await fetch(
    //   'https://api.openai.com/v1/embeddings',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    //     },
    //     body: JSON.stringify({
    //       input: searchQuery,
    //       model: 'text-embedding-3-small',
    //     }),
    //   },
    // );

    // const embeddingData = await embeddingResponse.json();
    // const embedding = embeddingData.data[0].embedding;

    const searchParameters = {
      q: searchQuery || '*',
      query_by: 'numberString,issueNumber,title,descriptionString,embeddings',
      filter_by: `workspaceId:=${workspaceId}`,
      sort_by: searchQuery ? '_text_match:desc' : 'number:desc',
      vector_query: `embeddings:([], distance_threshold:${vectorDistance})`,
      page: 1,
      per_page: limit,
    };

    // const searchParameters = {
    //   searches: [
    //     {
    //       collection: 'issues',
    //       q: '*',
    //       query_by: 'numberString,issueNumber,title,description,embeddings',
    //       vector_query: `embeddings:([${embedding}], distance_threshold:${vectorDistance})`,
    //       filter_by: `workspaceId:=${workspaceId}`,
    //       page: 1,
    //       per_page: limit,
    //     },
    //   ],
    // };
    console.log('vectorDistance after:', searchParameters);
    // console.log(typeof embedding);

    // const searchResults =
    //   await this.typesenseClient.multiSearch.perform(searchParameters);

    // console.log(JSON.stringify(searchResults));

    const searchResults = await this.typesenseClient
      .collections('issues')
      .documents()
      .search(searchParameters);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return searchResults.hits.map((hit: any) => ({
      id: hit.document.id,
      title: hit.document.title,
      description: hit.document.description,
      stateId: hit.document.stateId,
      teamId: hit.document.teamId,
      number: hit.document.number,
      issueNumber: hit.document.issueNumber,
      assigneeId: hit.document.assigneeId,
      score: hit.hybrid_search_info?.rank_fusion_score || 0,
    }));

    // return (
    //   searchResults.results
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     .map(({ hits }: any) =>
    //       hits?.map(
    //         ({
    //           document: {
    //             id,
    //             title,
    //             description,
    //             stateId,
    //             teamId,
    //             number,
    //             issueNumber,
    //           },
    //           vector_distance,
    //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         }: any) => ({
    //           id,
    //           title,
    //           description,
    //           stateId,
    //           teamId,
    //           number,
    //           issueNumber,
    //           distance: vector_distance,
    //         }),
    //       ),
    //     )
    //     .flat()
    // );
  }

  async similarIssues(workspaceId: string, issueId: string, limit: number) {
    const searchRequests = {
      searches: [
        {
          collection: 'issues',
          q: '*',
          query_by: 'numberString,issueNumber,title,description,embedding',
          vector_query: `embedding:([], id: ${issueId}, distance_threshold:0.50)`,
          filter_by: `workspaceId:=${workspaceId}`,
          page: 1,
          per_page: limit,
        },
      ],
    };

    const searchResults =
      await this.typesenseClient.multiSearch.perform(searchRequests);

    return (
      searchResults.results
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
              },
              vector_distance,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }: any) => ({
              id,
              title,
              description,
              stateId,
              teamId,
              number,
              issueNumber,
              distance: vector_distance,
            }),
          ),
        )
        .flat()
    );
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
