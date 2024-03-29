import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChromaClient, DefaultEmbeddingFunction } from 'chromadb';
import { IssueWithRelations } from 'modules/issues/issues.interface';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class VectorService implements OnModuleInit {
  private embeddingFunction: DefaultEmbeddingFunction;

  constructor(
    private chromaClient: ChromaClient,
    private prisma: PrismaService,
  ) {
    this.embeddingFunction = new DefaultEmbeddingFunction();
  }

  async onModuleInit() {
    // await this.prefillIssuesData('20363b77-0125-4f34-9d62-c038835d62bc');
    // const results = await this.searchEmbeddings(
    //   `issues_20363b77-0125-4f34-9d62-c038835d62bc`,
    //   await this.generateEmbedding(`create notifications`),
    //   5,
    // );
    // console.log(results);
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const embedding = await this.embeddingFunction.generate([text]);
    return embedding[0];
  }

  async createIssueEmbedding(workspaceId: string, issue: IssueWithRelations) {
    const issueNumber = `${issue.team.identifier}-${issue.number}`;
    const embedding = await this.generateEmbedding(
      `${issueNumber} ${issue.title} ${issue.description}`,
    );
    await this.addEmbedding(`issues_${workspaceId}`, embedding, {
      id: issue.id,
      identifier: issueNumber,
      title: issue.title,
      stateId: issue.stateId,
    });
  }

  async addEmbedding(
    collectionName: string,
    embedding: number[],
    metadata: Record<string, any>,
  ) {
    const collection = await this.chromaClient.getOrCreateCollection({
      name: collectionName,
    });
    await collection.upsert({
      embeddings: [embedding],
      metadatas: [metadata],
      ids: [metadata.id],
    });
  }

  async searchEmbeddings(
    collectionName: string,
    query: number[],
    limit: number,
  ) {
    const collection = await this.chromaClient.getCollection({
      name: collectionName,
    });
    const results = await collection.query({
      queryEmbeddings: query,
      nResults: limit,
    });

    return results;
  }

  async prefillIssuesData(workspaceId: string) {
    const issues = await this.prisma.issue.findMany({
      where: { team: { workspaceId }, deleted: null },
      include: { team: true },
    });

    for (const issue of issues) {
      await this.createIssueEmbedding(workspaceId, issue);
    }

    console.log(
      `Prefilled all issues data into vector for workspaceId: ${workspaceId}`,
    );
  }
}
