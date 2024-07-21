import { Injectable } from '@nestjs/common';

import { VectorService } from 'modules/vector/vector.service';

@Injectable()
export default class SearchService {
  constructor(private vectorService: VectorService) {}

  async searchData(
    workspaceId: string,
    query: string,
    limit: number = 10,
    vectorDistance: number,
  ) {
    const searchData = await this.vectorService.searchEmbeddings(
      workspaceId,
      query,
      limit,
      vectorDistance,
    );

    return searchData;
  }

  async similarData(workspaceId: string, issueId: string) {
    const similarIssues = await this.vectorService.similarIssues(
      workspaceId,
      issueId,
    );

    return similarIssues;
  }
}
